const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const githubToken = core.getInput('github_token');

    const [owner, repo] = core.getInput('repo').split('/');
    const number =
      core.getInput('number') === ''
        ? github.context.issue.number
        : parseInt(core.getInput('number'));

    const client = new github.GitHub(githubToken);
    await client.issues.addLabels({
      labels: ['hello'],
      owner,
      repo,
      issue_number: number,
    });
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
