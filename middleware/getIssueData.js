async function getIssueData(ctx, next) {
  const { githubContext } = ctx;

  const issueData = {
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo,
    issue_number: githubContext.issue.number,
  };

  ctx.issueData = issueData;

  next();
}

module.exports = getIssueData;
