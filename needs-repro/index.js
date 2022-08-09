const action = require('./action');

const Pipeline = require('../common/Pipeline');

const didMaintainerChangeLabels = require('../middleware/didMaintainerChangeLabels');

// prettier-ignore
new Pipeline()
  .use(didMaintainerChangeLabels)
  .use(action)
  .run();
