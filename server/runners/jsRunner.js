/**
 * JavaScript Execution Runner
 * Instruments user code via Acorn AST injection, then executes in a vm sandbox.
 * Returns a normalized JSON trace array.
 *
 * Strategy: inject __trace__(lineNo, { var1: expr1, var2: expr2, ... }) at each step,
 * capturing variable values by name at the point of execution.
 * This handles let/const/var in all scopes.
 */
const acorn = require('acorn');
const escodegen = require('escodegen');
const vm = require('vm');

const MAX_STEPS = 2000;
const TIMEOUT_MS = 8000;

/**
 * Safely serialize a JS value for JSON transport.
 */
function safeSerialize(val, depth = 0) {
  if (depth > 4) return '<max depth>';
  if (val === null || val === undefined) return val;
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (typeof val !== 'object') return val;
  if (Array.isArray(val)) {
    return val.slice(0, 50).map((v) => safeSerialize(v, depth + 1));
  }
  try {
    const out = {};
    const keys = Object.keys(val).slice(0, 30);
    for (const k of keys) out[k] = safeSerialize(val[k], depth + 1);
    return out;
  } catch {
    return String(val);
  }
}

/**
 * Collect all declared identifier names from the AST top-level and function bodies.
 * This lets us pass the right names into __trace__ calls.
 */
function collectDeclaredNames(ast) {
  const names = new Set();

  function visitDeclaration(node) {
    if (!node) return;
    if (node.type === 'VariableDeclaration') {
      for (const decl of node.declarations) {
        if (decl.id && decl.id.type === 'Identifier') {
          names.add(decl.id.name);
        }
        // Destructuring: { a, b } = ...
        if (decl.id && decl.id.type === 'ObjectPattern') {
          for (const prop of decl.id.properties || []) {
            if (prop.key && prop.key.type === 'Identifier') names.add(prop.key.name);
          }
        }
        if (decl.id && decl.id.type === 'ArrayPattern') {
          for (const el of decl.id.elements || []) {
            if (el && el.type === 'Identifier') names.add(el.name);
          }
        }
      }
    }
    if (node.type === 'FunctionDeclaration' && node.id) {
      names.add(node.id.name);
    }
    if (node.type === 'ClassDeclaration' && node.id) {
      names.add(node.id.name);
    }
    // For-loop variable
    if (node.type === 'ForStatement' && node.init) visitDeclaration(node.init);
    if (node.type === 'ForInStatement' && node.left) visitDeclaration(node.left);
    if (node.type === 'ForOfStatement' && node.left) visitDeclaration(node.left);
    // Walk into block bodies
    if (node.body) {
      const body = Array.isArray(node.body) ? node.body : node.body.body;
      if (Array.isArray(body)) body.forEach(visitDeclaration);
    }
    // Function params
    if (node.params) {
      for (const p of node.params) {
        if (p.type === 'Identifier') names.add(p.name);
      }
    }
    // Function body
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      if (node.body && node.body.body) node.body.body.forEach(visitDeclaration);
    }
  }

  for (const node of ast.body) visitDeclaration(node);
  return names;
}

/**
 * Build an object expression for variable capture using try/catch per var
 * to safely handle temporal dead zone and reference errors.
 * We generate: { x: (function(){try{return x}catch(e){return undefined}})(), ... }
 */
function buildSafeVarCapture(names) {
  const props = [];
  for (const name of names) {
    props.push({
      type: 'Property',
      key: { type: 'Identifier', name },
      value: {
        type: 'CallExpression',
        callee: {
          type: 'FunctionExpression',
          id: null,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'TryStatement',
                block: {
                  type: 'BlockStatement',
                  body: [{
                    type: 'ReturnStatement',
                    argument: { type: 'Identifier', name },
                  }],
                },
                handler: {
                  type: 'CatchClause',
                  param: { type: 'Identifier', name: '__e__' },
                  body: {
                    type: 'BlockStatement',
                    body: [{
                      type: 'ReturnStatement',
                      argument: {
                        type: 'UnaryExpression',
                        operator: 'void',
                        prefix: true,
                        argument: { type: 'Literal', value: 0, raw: '0' },
                      },
                    }],
                  },
                },
                finalizer: null,
              },
            ],
          },
          expression: false,
          generator: false,
          async: false,
        },
        arguments: [],
      },
      kind: 'init',
      computed: false,
      method: false,
      shorthand: false,
    });
  }
  return { type: 'ObjectExpression', properties: props };
}


/**
 * Build a __trace__(lineNo, {vars}) call AST node.
 * Uses buildSafeVarCapture to avoid TDZ errors with let/const.
 */
function buildTraceCall(lineNo, names) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: '__trace__' },
      arguments: [
        { type: 'Literal', value: lineNo },
        buildSafeVarCapture(names),
      ],
    },
  };
}

/**
 * Instrument an AST body array: append a __trace__ call AFTER each statement.
 * Injecting AFTER avoids TDZ errors for let/const declarations.
 */
function instrumentBody(bodyArray, declaredNames) {
  const newBody = [];
  for (const node of bodyArray) {
    // Don't double-instrument our injected calls
    if (
      node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression' &&
      node.expression.callee.name === '__trace__'
    ) {
      newBody.push(node);
      continue;
    }

    // Recursively instrument nested blocks
    if (node.type === 'IfStatement') {
      if (node.consequent && node.consequent.type === 'BlockStatement') {
        node.consequent.body = instrumentBody(node.consequent.body, declaredNames);
      }
      if (node.alternate && node.alternate.type === 'BlockStatement') {
        node.alternate.body = instrumentBody(node.alternate.body, declaredNames);
      }
    }
    if (node.type === 'WhileStatement' || node.type === 'DoWhileStatement' || node.type === 'ForStatement' || node.type === 'ForInStatement' || node.type === 'ForOfStatement') {
      if (node.body && node.body.type === 'BlockStatement') {
        node.body.body = instrumentBody(node.body.body, declaredNames);
      }
    }
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
      if (node.body && node.body.type === 'BlockStatement') {
        // Collect params + outer names for function scope
        const fnNames = new Set(declaredNames);
        for (const p of node.params || []) {
          if (p.type === 'Identifier') fnNames.add(p.name);
        }
        // Collect locals within function
        if (node.body.body) {
          for (const s of node.body.body) {
            if (s.type === 'VariableDeclaration') {
              for (const d of s.declarations) {
                if (d.id && d.id.type === 'Identifier') fnNames.add(d.id.name);
              }
            }
          }
        }
        node.body.body = instrumentBody(node.body.body, fnNames);
      }
    }
    if (node.type === 'BlockStatement') {
      node.body = instrumentBody(node.body, declaredNames);
    }
    if (node.type === 'TryStatement') {
      if (node.block) node.block.body = instrumentBody(node.block.body, declaredNames);
      if (node.handler && node.handler.body) node.handler.body.body = instrumentBody(node.handler.body.body, declaredNames);
      if (node.finalizer) node.finalizer.body = instrumentBody(node.finalizer.body, declaredNames);
    }

    newBody.push(node);
    // Inject trace AFTER the statement so let/const are initialized
    if (node.loc) {
      newBody.push(buildTraceCall(node.loc.start.line, declaredNames));
    }
  }
  return newBody;
}

/**
 * Main runner — takes code string, returns trace array.
 */
function runJavaScript(code) {
  // 1. Parse to AST
  let ast;
  try {
    ast = acorn.parse(code, {
      ecmaVersion: 2022,
      sourceType: 'script',
      locations: true,
    });
  } catch (parseErr) {
    return {
      steps: [{
        line: parseErr.loc ? parseErr.loc.line : 1,
        event: 'exception',
        variables: {},
        callStack: [],
        output: '',
        error: `SyntaxError: ${parseErr.message}`,
      }],
      error: parseErr.message,
    };
  }

  // 2. Collect all declared variable names
  const declaredNames = collectDeclaredNames(ast);

  // 3. Instrument AST
  ast.body = instrumentBody(ast.body, declaredNames);

  // 4. Generate instrumented code
  let instrumented;
  try {
    instrumented = escodegen.generate(ast, { format: { compact: false } });
  } catch (genErr) {
    return { steps: [], error: `Code generation failed: ${genErr.message}` };
  }

  // 5. Set up sandbox
  const steps = [];
  let outputBuffer = '';
  let stepCount = 0;

  const sandbox = {
    console: {
      log: (...args) => { outputBuffer += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; },
      error: (...args) => { outputBuffer += '[error] ' + args.join(' ') + '\n'; },
      warn: (...args) => { outputBuffer += '[warn] ' + args.join(' ') + '\n'; },
    },
    Math, JSON, parseInt, parseFloat, isNaN, isFinite, String, Number, Boolean,
    Array, Object, Date, RegExp, Set, Map, Promise,
    setTimeout: () => {}, setInterval: () => {}, clearTimeout: () => {}, clearInterval: () => {},
    __trace__: function(lineNo, vars) {
      if (stepCount >= MAX_STEPS) throw new Error('__MAX_STEPS_EXCEEDED__');
      stepCount++;

      // Filter out undefined-valued vars (not yet declared)
      const filteredVars = {};
      for (const [k, v] of Object.entries(vars || {})) {
        if (v !== undefined) {
          try { filteredVars[k] = safeSerialize(v); } catch { /* skip */ }
        }
      }

      steps.push({
        line: lineNo,
        event: 'line',
        variables: filteredVars,
        callStack: [],
        output: outputBuffer,
      });
    },
  };

  vm.createContext(sandbox);

  // 6. Execute with timeout
  try {
    vm.runInContext(instrumented, sandbox, { timeout: TIMEOUT_MS });
  } catch (err) {
    if (err.message === '__MAX_STEPS_EXCEEDED__') {
      steps.push({
        line: -1,
        event: 'exception',
        variables: {},
        callStack: [],
        output: outputBuffer,
        error: `Execution stopped: exceeded ${MAX_STEPS} steps (possible infinite loop).`,
      });
    } else {
      steps.push({
        line: -1,
        event: 'exception',
        variables: {},
        callStack: [],
        output: outputBuffer,
        error: err.message,
      });
    }
  }

  return { steps, finalOutput: outputBuffer };
}

module.exports = { runJavaScript };
