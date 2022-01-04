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

    const user = payload.sender.login;
    const issue = await octokit.request(
      'GET /repos/{owner}/{repo}/issues/{issue_number}',
      issueData
    );
    const { body } = issue;

    const comments = await octokit.rest.issues.listComments(issueData);
    const commentBodies = comments.data.map((comment) => comment.body);
    console.log('commentBodies', commentBodies);
    const botComment = commentBodies.find((body) => body === needsReproResponse);

    const issueAndComments = [body, ...commentBodies];
    console.log({ issueAndComments });
    // Code adopted from https://stackoverflow.com/a/9229821/9999202
    const issueAndCommentsUniq = [...new Set(issueAndComments)];
    console.log({ issueAndCommentsUniq });

    const reproValidator = new ReproValidator(user);
    const hasValidRepro = issueAndCommentsUniq.some((body) => {
      // ONCE TOLD ME
      return reproValidator.isReproValid(body);
    });
    console.log({ hasValidRepro });

    // Code adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-repro.yml
    if (hasValidRepro) {
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

      if (!botComment) return;

      await octokit.rest.issues.deleteComment({
        ...issueData,
        comment_id: botComment.id,
      });
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

      if (botComment) return;

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
