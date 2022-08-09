const action = require('./action');

const Pipeline = require('../common/Pipeline');

const didMaintainerChangeLabels = require('../middleware/didMaintainerChangeLabels');
const getIssueData = require('../middleware/getIssueData');

// prettier-ignore
new Pipeline()
  .use(getIssueData)
  .use(didMaintainerChangeLabels)
  .use(action)
  .run();
