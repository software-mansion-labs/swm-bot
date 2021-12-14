const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const octokit = github.getOctokit(githubToken);

    const { context } = github;

    await octokit.rest.issues.addLabels({
      ...context.repo,
      issue_number: context.issue.number,
      labels: ['hello'],
    });
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
