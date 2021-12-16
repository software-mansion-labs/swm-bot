const core = require('@actions/core');
const github = require('@actions/github');
const ReproValidator = require('./ReproValidator');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const needsReproLabel = core.getInput('needs-repro-label');
    const reproProvidedLabel = core.getInput('repro-provided-label');
    const noReproResponse = core.getInput('no-repro-response');

    const octokit = github.getOctokit(githubToken);

    const { context } = github;

    const issueData = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    };

    const { payload } = context;

    const body = payload.comment ? payload.comment.body : payload.issue.body;
    const user = payload.sender.login;

    const reproValidator = new ReproValidator(body, user);

    // Code adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-repro.yml
    if (reproValidator.isReproValid()) {
      await octokit.rest.issues.addLabels({
        ...issueData,
        labels: [reproProvidedLabel],
      });

      try {
        await github.issues.removeLabel({
          ...issueData,
          name: needsReproLabel,
        });
      } catch (error) {
        if (!/Label does not exist/.test(error.message)) {
          throw error;
        }
      }
    } else {
      const comments = await github.issues.listComments(issueData);

      if (comments.data.some((comment) => comment.body === noReproResponse)) {
        return;
      }

      await github.issues.createComment({
        ...issueData,
        body: noReproResponse,
      });

      await octokit.rest.issues.addLabels({
        ...issueData,
        labels: [needsReproLabel],
      });
    }
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
