const PlatformSelectorStrategy = require('.');

class FromCheckboxesStrategy extends PlatformSelectorStrategy {
  selectLabelsToAdd() {
    const platformsRegexPart = this._getPlatforms().join('|');
    // Adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-labels.yml
    const platformsRegex = new RegExp(`- \\[\\s?[^\\s]+\\s?\\] (${platformsRegexPart})`, 'gim');
    const checkboxSelectedPlatforms = this.issueBody.match(platformsRegex) || [];
    const selectedPlatforms = checkboxSelectedPlatforms.map((platformWithCheckbox) =>
      platformWithCheckbox.replace(/- \[\s?[^\s]+\s?\]\s?/g, '')
    );
    return selectedPlatforms.map((platform) => this.platformsWithLabels[platform]);
  }
}

module.exports = FromCheckboxesStrategy;
