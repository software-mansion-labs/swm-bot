const action = require('./action');

const Pipeline = require('../common/Pipeline');

const getOctokit = require('../middleware/getOctokit');
const getIssueData = require('../middleware/getIssueData');

// prettier-ignore
new Pipeline()
  .use(getOctokit)
  .use(getIssueData)
  .use(action)
  .run();
