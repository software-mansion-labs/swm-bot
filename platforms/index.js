const core = require('@actions/core');
const github = require('@actions/github');
const PlatformSelector = require('./PlatformSelector');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const platformsWithLabels = core.getInput('platforms-with-labels');

    const octokit = github.getOctokit(githubToken);

    const { context } = github;

    const issueData = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    };

    const { payload } = context;
    const { body } = payload.issue;

    const platformSelector = new PlatformSelector(body, platformsWithLabels);

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
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
