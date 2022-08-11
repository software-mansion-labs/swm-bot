const core = require('@actions/core');
const github = require('@actions/github');

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

async function action({ octokit, issueData }) {
  const closeWhenStaleLabel = core.getInput('close-when-stale-label');
  const daysToClose = core.getInput('days-to-close');

  const { context } = github;
  const { payload } = context;

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
      return;
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

  // Close inactive issues with `closeWhenStaleLabel` label
  const currentDate = new Date();

  const issues = await octokit.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    labels: [closeWhenStaleLabel],
    state: 'open',
  });

  const issuesToClose = issues.data.filter((issue) => {
    const issueDate = new Date(issue.updated_at);

    const difference = currentDate.getTime() - issueDate.getTime();
    const differenceInDays = difference / MILLISECONDS_IN_A_DAY;

    return differenceInDays >= daysToClose;
  });

  if (!issuesToClose.length) {
    core.notice(`No issues to close`);
    return;
  }

  const issueNumbersToClose = issuesToClose.map((issue) => issue.number);

  const issuesToClosePromises = issueNumbersToClose.map((issueNumber) =>
    octokit.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      state: 'closed',
    })
  );

  const settledPromises = await Promise.allSettled(issuesToClosePromises);

  // Print closed and failed to close issue numbers
  const issuesToPrint = settledPromises.map(({ status }, i) => ({
    status,
    issue: issueNumbersToClose[i],
  }));

  const closedIssuesWithStatus = issuesToPrint.filter((issue) => issue.status === 'fulfilled');
  const failedToCloseIssuesWithStatus = issuesToPrint.filter(
    (issue) => issue.status !== 'fulfilled'
  );

  const closedIssues = closedIssuesWithStatus.map((issue) => issue.issue);
  const failedToCloseIssues = failedToCloseIssuesWithStatus.map((issue) => issue.issue);

  core.notice(`Closed issues: ${closedIssues.join(', ')}`);
  if (failedToCloseIssues.length) {
    core.notice(`Issues that failed to close: ${failedToCloseIssues.join(', ')}`);
  }
}

module.exports = action;
