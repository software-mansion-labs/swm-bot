const core = require('@actions/core');
const github = require('@actions/github');
const IssueTemplateValidator = require('./IssueTemplateValidator');
const MissingSectionsFormatter = require('./MissingSectionsFormatter');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const needsMoreInfoLabel = core.getInput('needs-more-info-label');
    const requiredSectionsString = core.getInput('required-sections');
    const needsMoreInfoResponse = core.getInput('needs-more-info-response');

    const octokit = github.getOctokit(githubToken);

    const { context } = github;

    const issueData = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    };

    const { payload } = context;
    const { body } = payload.issue;

    const comments = await octokit.rest.issues.listComments(issueData);
    const comment = comments.data.find((comment) => comment.body.includes(needsMoreInfoResponse));

    const missingSectionsFormatter = new MissingSectionsFormatter();
    const requiredSections = missingSectionsFormatter.parse(requiredSectionsString);

    const issueTemplateValidator = new IssueTemplateValidator(body, requiredSections);
    const invalidSections = issueTemplateValidator.validate();

    if (invalidSections.length) {
      await octokit.rest.issues.addLabels({
        ...context.repo,
        issue_number: context.issue.number,
        labels: [needsMoreInfoLabel],
      });

      const formattedResponse = missingSectionsFormatter.format(
        needsMoreInfoResponse,
        invalidSections
      );

      if (!comment) {
        await octokit.rest.issues.createComment({
          ...issueData,
          body: formattedResponse,
        });
      } else {
        await octokit.rest.issues.updateComment({
          ...issueData,
          comment_id: comment.id,
          body: formattedResponse,
        });
      }
    } else {
      try {
        await octokit.rest.issues.removeLabel({
          ...issueData,
          name: needsMoreInfoLabel,
        });
      } catch (error) {
        if (!/Label does not exist/.test(error.message)) {
          throw error;
        }
      }

      if (!comment) return;

      await octokit.rest.issues.deleteComment({
        ...issueData,
        comment_id: comment.id,
      });
    }
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
