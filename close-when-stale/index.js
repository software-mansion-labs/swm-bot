const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const closeWhenStaleLabel = core.getInput('close-when-stale-label');
    const daysToClose = core.getInput('days-to-close');

    const octokit = github.getOctokit(githubToken);

    const { context } = github;

    const issueData = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    };

    const { payload } = context;

    // Don't run on pull requests
    if (payload.issue?.pull_request) {
      core.notice('Action triggered by a comment added on a pull request.');
      return;
    }

    // Remove label when activity detected
    if (context.eventName === 'issues' || context.eventName === 'issue_comment') {
      if (payload.sender.type === 'Bot') {
        core.notice('Triggered by a bot - do nothing');
        return;
      }

      const response = await octokit.rest.repos.getCollaboratorPermissionLevel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        username: payload.sender.login,
      });

      const permission = response.data.permission;
      const hasWriteAccess = permission === 'write' || permission === 'admin';

      if (hasWriteAccess) {
        core.notice('Triggered by a user with write access - do nothing');
        // return;
      }

      core.notice(`Issue has some activity - removing ${closeWhenStaleLabel} label.`);

      try {
        await octokit.rest.issues.removeLabel({
          ...issueData,
          name: closeWhenStaleLabel,
        });
      } catch (error) {
        if (!/Label does not exist/.test(error.message)) {
          throw error;
        }
      }

      return;
    }

    const currentDate = new Date();

    const issues = await octokit.rest.issues.listForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
      labels: [closeWhenStaleLabel],
      state: 'open',
    });

    issues.data.forEach(async (issue) => {
      const issueDate = new Date(issue.updated_at);

      const difference = currentDate.getTime() - issueDate.getTime();
      const differenceInDays = difference / (1000 * 3600 * 24);

      if (differenceInDays >= daysToClose) {
        // Could be done in bulk with Promise.all rather than in a loop tbh
        const { status } = await octokit.rest.issues.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          state: 'closed',
        });

        if (status === 200) {
          core.notice(`Closed issue ${issue.number}`);
        }
      }
    });
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
