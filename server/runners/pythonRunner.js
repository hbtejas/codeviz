/**
 * Python Execution Runner
 * Spawns a Python child process running pythonTracer.py with user code injected.
 * Parses JSON output into a normalized trace array.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const TRACER_PATH = path.join(__dirname, 'pythonTracer.py');
const TIMEOUT_MS = 10000;

// Try common Python executable names
function getPythonExecutable() {
  // On Windows, 'python' is common; on Linux/macOS, 'python3'
  return process.platform === 'win32' ? 'python' : 'python3';
}

function runPython(code) {
  return new Promise((resolve) => {
    // Read tracer template and inject user code safely
    let tracerCode;
    try {
      tracerCode = fs.readFileSync(TRACER_PATH, 'utf8');
    } catch (err) {
      return resolve({ steps: [], error: `Tracer not found: ${err.message}` });
    }

    // Inject user code — replace placeholder, escaping backlash sequences
    const escapedCode = code.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');
    const finalScript = tracerCode.replace('"""__USER_CODE_PLACEHOLDER__"""', `"""${escapedCode}"""`);

    // Write to a temp file (more reliable than stdin on Windows)
    const tmpFile = path.join(os.tmpdir(), `codeviz_${Date.now()}_${Math.random().toString(36).slice(2)}.py`);
    fs.writeFileSync(tmpFile, finalScript, 'utf8');

    const pythonExe = getPythonExecutable();
    const child = spawn(pythonExe, [tmpFile], {
      timeout: TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    const cleanup = () => {
      try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
    };

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      cleanup();
      resolve({
        steps: [{
          line: -1,
          event: 'exception',
          variables: {},
          callStack: [],
          output: stdout,
          error: 'Execution timed out (10 seconds). Check for infinite loops.',
        }],
        error: 'Timeout',
      });
    }, TIMEOUT_MS + 1000);

    child.on('close', (code) => {
      clearTimeout(timer);
      cleanup();

      if (!stdout.trim()) {
        // Python wasn't found or script failed to start
        const errMsg = stderr.includes('not recognized') || stderr.includes('No such file')
          ? `Python not found. Please install Python 3 and ensure it's in your PATH.`
          : `Python error: ${stderr.slice(0, 500)}`;
        return resolve({ steps: [], error: errMsg });
      }

      try {
        // The last non-empty line should be our JSON result
        const lines = stdout.trim().split('\n');
        const jsonLine = lines[lines.length - 1];
        const result = JSON.parse(jsonLine);
        resolve(result);
      } catch (parseErr) {
        resolve({
          steps: [],
          error: `Failed to parse Python output: ${parseErr.message}\nStdout: ${stdout.slice(0, 200)}\nStderr: ${stderr.slice(0, 200)}`,
        });
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      cleanup();
      const msg = err.code === 'ENOENT'
        ? `Python executable not found. Install Python 3 and add it to PATH.`
        : err.message;
      resolve({ steps: [], error: msg });
    });
  });
}

module.exports = { runPython };
