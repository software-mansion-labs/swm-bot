const normalizeIssue = require('../common/normalizeIssue');

class PlatformSelector {
  constructor(issueBody, platformsWithLabelsString) {
    this.issueBody = normalizeIssue(issueBody || '');
    this.platformsWithLabels = JSON.parse(platformsWithLabelsString);
  }

  selectLabelsToAdd() {
    const platformsRegexPart = this._getPlatforms().join('|');
    // Adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-labels.yml
    const platformsRegex = new RegExp(`- \\[\\s?x\\s?\\] (${platformsRegexPart})`, 'gim');
    const checkboxSelectedPlatforms = this.issueBody.match(platformsRegex) || [];
    const selectedPlatforms = checkboxSelectedPlatforms.map((platformWithCheckbox) =>
      platformWithCheckbox.replace(/- \[\s?x\s?\]\s?/g, '')
    );
    return selectedPlatforms.map((platform) => this.platformsWithLabels[platform]);
  }

  // Code adopted from https://melvingeorge.me/blog/remove-elements-contained-in-another-array-javascript
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

module.exports = PlatformSelector;
