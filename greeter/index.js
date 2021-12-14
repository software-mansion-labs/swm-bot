const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const githubToken = core.getInput('github_token');

    const client = new github.GitHub(githubToken);
    const [owner, repo] = github.context.repo;

    await client.issues.addLabels({
      labels: ['hello'],
      owner,
      repo,
      issue_number: github.context.issue.number,
    });
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
