/**
 * Java Runner — Stub
 * Full implementation requires Docker + JDI (Java Debug Interface).
 * TODO: Wire up Docker container with javac + jdb/JDI stepping.
 */
function runJava(code) {
  return Promise.resolve({
    steps: [{
      line: 1,
      event: 'line',
      variables: {},
      callStack: [{ function: 'main', line: 1 }],
      output: '',
      error: null,
    }],
    error: 'Java runner is not yet available. It requires Docker + JDI integration (coming soon).',
    stubMessage: 'Java execution requires Docker with OpenJDK + JDI. See server/docker/java.Dockerfile.',
  });
}

module.exports = { runJava };
