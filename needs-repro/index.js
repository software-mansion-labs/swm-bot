const action = require('./action');

const Pipeline = require('../common/Pipeline');

const getOctokit = require('../middleware/getOctokit');
const getIssueData = require('../middleware/getIssueData');
const didTriggerOnClosedIssue = require('../middleware/didTriggerOnClosedIssue');
const didTriggerOnPullRequest = require('../middleware/didTriggerOnPullRequest');
const didMaintainerChangeLabels = require('../middleware/didMaintainerChangeLabels');

// prettier-ignore
new Pipeline()
  .use(getOctokit)
  .use(getIssueData)
  .use(didTriggerOnClosedIssue)
  .use(didTriggerOnPullRequest)
  .use(didMaintainerChangeLabels)
  .use(action)
  .run();
