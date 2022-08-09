const withErrorHandling = require('../common/withErrorHandling');
const Pipeline = require('../common/Pipeline');

const action = require('./action');

new Pipeline()
  .use(() => {
    withErrorHandling(action);
  })
  .run();
