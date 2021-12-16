const core = require('@actions/core');
const github = require('@actions/github');
const ReproValidator = require('./ReproValidator');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const needsMoreInfoLabel = core.getInput('needs-more-info-label');
    const requiredSections = core.getInput('required-sections');

    const octokit = github.getOctokit(githubToken);

    const { context } = github;

    const issueData = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    };

    const { payload } = context;

    const body = payload.comment ? payload.comment.body : payload.issue.body;
    const user = payload.sender.login;

    const issueTemplateValidator = new IssueTemplateValidator(body, user, requiredSections);
    const invalidSections = issueTemplateValidator.validate();
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
