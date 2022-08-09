const core = require('@actions/core');
const github = require('@actions/github');

const PlatformSelector = require('./PlatformSelector');

async function action() {
  const githubToken = core.getInput('github-token');
  const platformsWithLabels = core.getInput('platforms-with-labels');
  const areCommaSeparated = core.getBooleanInput('platforms-comma-separated');
  const platformsSectionHeader = core.getInput('platforms-section-header');

  const octokit = github.getOctokit(githubToken);

  const { context } = github;

  const issueData = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  };

  const { payload } = context;
  const { body } = payload.issue;

  const platformSelector = new PlatformSelector(
    body,
    platformsWithLabels,
    areCommaSeparated,
    platformsSectionHeader
  );

  const labelsToAdd = platformSelector.selectLabelsToAdd();
  const labelsToRemove = platformSelector.selectLabelsToRemove();

  if (labelsToAdd.length) {
    await octokit.rest.issues.addLabels({
      ...issueData,
      labels: labelsToAdd,
    });
  }

  if (labelsToRemove.length) {
    try {
      const removeLabelPromises = labelsToRemove.map((name) =>
        octokit.rest.issues.removeLabel({
          ...issueData,
          name,
        })
      );
      await Promise.all(removeLabelPromises);
    } catch (error) {
      if (!/Label does not exist/.test(error.message)) {
        throw error;
      }
    }
  }
}

module.exports = action;
