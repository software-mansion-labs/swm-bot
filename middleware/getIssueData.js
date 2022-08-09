const github = require('@actions/github');

async function getIssueData(ctx, next) {
  const { context } = github;

  const issueData = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  };

  ctx.issueData = issueData;

  next();
}

module.exports = getIssueData;
