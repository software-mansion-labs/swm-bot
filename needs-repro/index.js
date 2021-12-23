const core = require('@actions/core');
const github = require('@actions/github');
const ReproValidator = require('./ReproValidator');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const needsReproLabel = core.getInput('needs-repro-label');
    const reproProvidedLabel = core.getInput('repro-provided-label');
    const needsReproResponse = core.getInput('needs-repro-response');

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

    const comments = await octokit.rest.issues.listComments(issueData);

    const comment = comments.data.find((comment) => comment.body === needsReproResponse);

    // Code adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-repro.yml
    if (reproValidator.isReproValid()) {
      await octokit.rest.issues.addLabels({
        ...issueData,
        labels: [reproProvidedLabel],
      });

      try {
        await octokit.rest.issues.removeLabel({
          ...issueData,
          name: needsReproLabel,
        });
      } catch (error) {
        if (!/Label does not exist/.test(error.message)) {
          throw error;
        }
      }

      if (!comment) return;

      try {
        await octokit.rest.issues.deleteComment({
          ...issueData,
          comment_id: comment.id,
        });
      } catch (error) {
        if (!/Comment does not exist/.test(error.message)) {
          throw error;
        }
      }
    } else {
      await octokit.rest.issues.addLabels({
        ...issueData,
        labels: [needsReproLabel],
      });

      try {
        await octokit.rest.issues.removeLabel({
          ...issueData,
          name: reproProvidedLabel,
        });
      } catch (error) {
        if (!/Label does not exist/.test(error.message)) {
          throw error;
        }
      }

      if (comment) return;

      await octokit.rest.issues.createComment({
        ...issueData,
        body: needsReproResponse,
      });
    }
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
