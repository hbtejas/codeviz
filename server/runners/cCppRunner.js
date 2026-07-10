/**
 * C/C++ Runner — Stub
 * Full implementation requires Docker + GDB MI2 integration.
 * TODO: Wire up Docker container with gcc/g++ -g compilation + gdb --interpreter=mi2
 */
function runCCpp(code, language) {
  return Promise.resolve({
    steps: [{
      line: 1,
      event: 'line',
      variables: {},
      callStack: [{ function: 'main', line: 1 }],
      output: '',
      error: null,
    }],
    error: `${language.toUpperCase()} runner is not yet available. It requires Docker + GDB MI2 integration (coming soon).`,
    stubMessage: 'C/C++ execution requires Docker with GCC/G++ + GDB. See server/docker/cpp.Dockerfile.',
  });
}

module.exports = { runCCpp };
