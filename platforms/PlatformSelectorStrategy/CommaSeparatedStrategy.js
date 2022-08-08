const PlatformSelectorStrategy = require('.');

class CommaSeparatedStrategy extends PlatformSelectorStrategy {
  constructor(issueBody, platformsWithLabels, platformsSectionHeader) {
    super(issueBody, platformsWithLabels);

    if (platformsSectionHeader == null) {
      throw new Error(
        '`platforms-section-header` needs to be passed to action when using platforms comma-separated syntax'
      );
    }

    this.platformsSectionHeader = platformsSectionHeader;
  }

  selectLabelsToAdd() {
    const platforms = this._getPlatforms();
    const selectedPlatformsString = this._betweenMarkers(
      this.issueBody,
      this.platformsSectionHeader
    );

    const trimmedSelectedPlatforms = selectedPlatformsString.replace(/\s/g, '');
    const dirtySelectedPlatforms = trimmedSelectedPlatforms
      .split(',')
      .map((platform) => platform.trim());

    const selectedPlatforms = platforms.filter((platform) =>
      dirtySelectedPlatforms.some((p) => p?.toLowerCase().includes(platform.toLowerCase()))
    );

    return selectedPlatforms.map((platform) => this.platformsWithLabels[platform]);
  }

  _betweenMarkers(text, begin, end = '#') {
    const firstChar = text.indexOf(begin) + begin.length;
    const lastChar = text.indexOf(end, firstChar);
    return text.substring(firstChar, lastChar === -1 ? text.length : lastChar);
  }
}

module.exports = CommaSeparatedStrategy;
