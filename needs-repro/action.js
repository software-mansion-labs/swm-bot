const core = require('@actions/core');
const github = require('@actions/github');

const ReproValidator = require('./ReproValidator');
const isDateBefore = require('../common/isDateBefore');

const withErrorHandling = require('../common/withErrorHandling');

async function action({ issueData }) {
  const githubToken = core.getInput('github-token');
  const needsReproLabel = core.getInput('needs-repro-label');
  const reproProvidedLabel = core.getInput('repro-provided-label');
  const needsReproResponse = core.getInput('needs-repro-response');
  const checkIssuesCreatedAfter = core.getInput('check-issues-only-created-after');
  const considerCodeSnippets = core.getBooleanInput('consider-code-snippets');

  const octokit = github.getOctokit(githubToken);

  const { context } = github;
  const { payload } = context;

  // Don't check for repro on pull requests
  if (payload.issue.pull_request) {
    core.notice('Action triggered by a comment added on a pull request.');
    return;
  }

  const issue = await octokit.rest.issues.get(issueData);
  const { body: issueBody, created_at: issueCreatedAt, user } = issue.data;

  const author = user.login;
  const commenter = payload.comment ? payload.sender.login : '';

  // A comment is added/edited/deleted
  if (checkIssuesCreatedAfter && payload.comment) {
    if (isDateBefore(issueCreatedAt, checkIssuesCreatedAfter)) {
      core.notice(
        `Action triggered by a comment added on an issue older than ${checkIssuesCreatedAfter}.`
      );
      return;
    }
  }

  const comments = await octokit.rest.issues.listComments(issueData);
  const botComment = comments.data.find((comment) => comment.body === needsReproResponse);

  let commentBodies = comments.data.map((comment) => comment.body);

  if (botComment) {
    commentBodies = commentBodies.filter((body) => body !== botComment.body);
  }

  const issueAndComments = [issueBody, ...commentBodies];
  // Code adopted from https://stackoverflow.com/a/9229821/9999202
  const issueAndCommentsUniq = [...new Set(issueAndComments)];

  const reproValidator = new ReproValidator(author, commenter, considerCodeSnippets);
  const hasValidRepro = issueAndCommentsUniq.some((body) => {
    // ONCE TOLD ME
    return reproValidator.isReproValid(body);
  });

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
}

module.exports = withErrorHandling(action);
