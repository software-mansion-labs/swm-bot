const action = require('./action');

const Pipeline = require('../common/Pipeline');

const getIssueData = require('../middleware/getIssueData');

// prettier-ignore
new Pipeline()
  .use(getIssueData)
  .use(action)
  .run();
