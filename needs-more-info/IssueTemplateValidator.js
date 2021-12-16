class ReproValidator {
  constructor(issueBody, requiredSections) {
    this.issueBody = issueBody;
    this.requiredSections = requiredSections;
  }

  _sectionExists(section) {
    return this._getSectionPosition(section) !== -1;
  }

  _getSectionPosition(section) {
    const regexp = new RegExp(`[#]+[ ]+${section}`);
    return this.issueBody.search(regexp);
  }

  // Code adopted from https://github.com/karol-bisztyga/issue-validator/blob/main/index.js
  _isSectionEmpty(section) {
    const sectionPosition = this._getSectionPosition(section);
    const sub = this.issueBody.substr(sectionPosition);
    const sectionStartIndex = sub.search(new RegExp(`${section}`)) + section.length;
    const nextSectionPos = sub.search(new RegExp('\n[#]+'));
    const end = nextSectionPos === -1 ? undefined : nextSectionPos;
    const sectionContent = sub.substring(sectionStartIndex, end);
    // Regex adopted from https://stackoverflow.com/a/57996414/9999202
    const sectionContentWithoutComment = sectionContent.replace(
      /(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g,
      ''
    );
    return sectionContentWithoutComment.replace(/\r?\n|\r/g, '').replace(/ /g, '').length === 0;
  }

  // TODO: implement
  validate() {
    throw new Error('Not implemented');
    return [];
  }
}

module.exports = ReproValidator;
