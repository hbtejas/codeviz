import type { TraceStep } from '../types';
import type { PatternPlugin, AnnotationMap } from './types';

/**
 * Backtracking Pattern Plugin
 * 
 * Handles recursion tracing, pruning, state choices (e.g. paths, subsets).
 */

export const backtrackingPlugin: PatternPlugin = {
  id: 'backtracking',
  name: 'Backtracking',
  description: 'Explores combinations or permutations, making a choice, recursing, and undoing/backtracking that choice.',
  color: 'var(--accent-amber)',

  detectRelevance(trace) {
    // Detect deep recursive stacks or undo patterns (e.g. variables changing back to prior states, pop/push operations)
    let maxStackDepth = 0;
    let pushPopEvents = 0;

    for (let i = 0; i < trace.length; i++) {
      const step = trace[i];
      if (step.callStack.length > maxStackDepth) {
        maxStackDepth = step.callStack.length;
      }
      
      // Look for backtracking indicators in variables (e.g. array length increasing and then decreasing)
      const prevStep = i > 0 ? trace[i - 1] : null;
      if (prevStep) {
        const hasLengthDrop = Object.keys(step.variables).some(k => {
          const curVal = step.variables[k];
          const prevVal = prevStep.variables[k];
          return Array.isArray(curVal) && Array.isArray(prevVal) && curVal.length < prevVal.length;
        });
        if (hasLengthDrop) pushPopEvents++;
      }
    }

    if (maxStackDepth > 3 && pushPopEvents > 0) return 0.9;
    if (maxStackDepth > 2) return 0.5;
    return 0;
  },

  annotateStep(step, prevStep) {
    const cellStates: AnnotationMap['cellStates'] = {};
    let desc = 'Backtracking search active';

    // Find any list-like choices variable (e.g., path, subset, current)
    let pathVarName = '';
    for (const [k, v] of Object.entries(step.variables)) {
      if (Array.isArray(v) && (k.toLowerCase().includes('path') || k.toLowerCase().includes('sub') || k.toLowerCase().includes('curr'))) {
        pathVarName = k;
        break;
      }
    }

    if (pathVarName) {
      const arr = step.variables[pathVarName] as unknown[];
      desc = `Backtracking Path [${pathVarName}]: [${arr.join(', ')}]`;
    }

    if (step.event === 'return') {
      desc += ' | Returning/Backtracking...';
    }

    return {
      cellStates,
      pointers: [],
      stepDescription: desc,
      patternHint: 'Backtracking / DFS'
    };
  }
};
