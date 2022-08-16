const core = require('@actions/core');

async function didTriggerOnClosedIssue({ githubContext }, next) {
  const { payload } = githubContext;

  if (payload?.issue?.state === 'closed') {
    core.notice('Action triggered on a closed issue. Skipping...');
    return;
  }

  next();
}

module.exports = didTriggerOnClosedIssue;
