const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    await github.issues.addLabels({
      issue_number: github.context.issue.number,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      labels: ['hello'],
    });
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
