const core = require('@actions/core');
const github = require('@actions/github');

async function getOctokit(ctx, next) {
  const githubToken = core.getInput('github-token');
  const octokit = github.getOctokit(githubToken);

  ctx.octokit = octokit;

  next();
}

module.exports = getOctokit;
