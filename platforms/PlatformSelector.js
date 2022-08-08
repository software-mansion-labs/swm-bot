const normalizeIssue = require('../common/normalizeIssue');
const CommaSeparatedStrategy = require('./PlatformSelectorStrategy/CommaSeparatedStrategy');
const FromCheckboxesStrategy = require('./PlatformSelectorStrategy/FromCheckboxesStrategy');

class PlatformSelector {
  constructor(
    issueBody,
    platformsWithLabelsString,
    areCommaSeparated = false,
    platformsSectionHeader
  ) {
    const normalizedIssueBody = normalizeIssue(issueBody || '');
    const platformsWithLabels = JSON.parse(platformsWithLabelsString);
    // Look mom, design patterns were useful in the end!
    this.strategy = areCommaSeparated
      ? new CommaSeparatedStrategy(normalizedIssueBody, platformsWithLabels, platformsSectionHeader)
      : new FromCheckboxesStrategy(normalizedIssueBody, platformsWithLabels);
  }

  /**
   * @returns string[]
   */
  selectLabelsToAdd() {
    return this.strategy.selectLabelsToAdd();
  }

  /**
   * @returns string[]
   */
  selectLabelsToRemove() {
    return this.strategy.selectLabelsToRemove();
  }
}

module.exports = PlatformSelector;
