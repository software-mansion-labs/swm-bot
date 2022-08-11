const core = require('@actions/core');

async function didTriggerOnPullRequest({ githubContext }, next) {
  const { payload } = githubContext;

  // Skip actions on pull requests
  if (payload.issue.pull_request) {
    core.notice('Action triggered by a comment added on a pull request. Skipping...');
    return;
  }

  next();
}

module.exports = didTriggerOnPullRequest;
