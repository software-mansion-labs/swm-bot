// const core = require('@actions/core');

async function didTriggerOnClosedIssue({ githubContext }, next) {
  const { payload } = githubContext;

  console.log(payload?.issue);

  next();
}

module.exports = didTriggerOnClosedIssue;
