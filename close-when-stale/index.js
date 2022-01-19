const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const closeWhenStaleLabel = core.getInput('close-when-stale-label');
    // const daysToClose = core.getInput('days-to-close');
    // const maintainerTeamName = core.getInput('maintainer-team-name');

    const octokit = github.getOctokit(githubToken);

    const { context } = github;

    const issueData = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    };

    const { payload } = context;

    // Don't run on pull requests
    if (payload.issue.pull_request) {
      core.notice('Action triggered by a comment added on a pull request.');
      return;
    }

    console.log('sender: ', payload.sender.login);

    // Remove label when activity detected
    if (context.eventName === 'issues' || context.eventName === 'issue_comment') {
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
    }

    // const issues = await octokit.rest.issues.list({
    //   ...issueData,
    //   labels: [closeWhenStaleLabel],
    //   state: 'open',
    // });

    // const maintainersData = await octokit.rest.teams.getByName({
    //   org: context.repo.owner,
    //   team_slug: maintainerTeamName,
    // });

    // const maintainers = maintainersData.data.map((maintainer) => maintainer.login);

    const comments = await octokit.rest.issues.listComments(issueData);
    const commentsWithoutBot = comments.data.filter((comment) => comment.user.type !== 'Bot');

    console.log(commentsWithoutBot);
    // const commenthWithoutMaintainers = commentsWithoutBot.data.filter(
    //   (comment) => !maintainers.some((maintainer) => maintainer === comment.user.login)
    // );
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
