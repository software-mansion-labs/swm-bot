const core = require('@actions/core');

async function withErrorHandling(fn) {
  try {
    await fn();
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

module.exports = withErrorHandling;
