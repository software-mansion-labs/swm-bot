class PlatformSelectorStrategy {
  constructor(issueBody, platformsWithLabels) {
    this.issueBody = issueBody;
    this.platformsWithLabels = platformsWithLabels;
  }

  selectLabelsToAdd() {
    throw new Error('Not implemented');
  }

  selectLabelsToRemove() {
    const allLabels = this._getPlatformLabels();
    const labelsToAdd = this.selectLabelsToAdd();
    const labelsToAddSet = new Set(labelsToAdd);
    return allLabels.filter((name) => !labelsToAddSet.has(name));
  }

  _getPlatforms() {
    return Object.keys(this.platformsWithLabels);
  }

  _getPlatformLabels() {
    return Object.values(this.platformsWithLabels);
  }
}

module.exports = PlatformSelectorStrategy;
