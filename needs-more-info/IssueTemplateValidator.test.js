const IssueTemplateValidator = require('./IssueTemplateValidator');

describe('IssueTemplateValidator', () => {
  describe('_sectionExists', () => {
    it('should return false when issue body is empty', () => {
      const issueBody = ``;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._sectionExists('Reproduction')).toBe(false);
    });

    it('should return true when section is present in issue body', () => {
      const issueBody = `
      ## Reproduction
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._sectionExists('Reproduction')).toBe(true);
    });

    it('should return true when multiple sections are present in issue body', () => {
      const issueBody = `
      ## Description

      Some text here

      ## Reproduction

      https://snack.expo.dev/@kacperkapusciak/example
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, [
        'Description',
        'Reproduction',
      ]);

      expect(issueTemplateValidator._sectionExists('Reproduction')).toBe(true);
      expect(issueTemplateValidator._sectionExists('Description')).toBe(true);
      expect(issueTemplateValidator._sectionExists('Food')).toBe(false);
    });
  });

  describe('_isSectionEmpty', () => {
    it('should return true when section is empty', () => {
      const issueBody = `
      ## Reproduction
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(true);
    });

    it('should return true when issue body is empty', () => {
      const issueBody = ``;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(true);
    });

    it('should return false when section is not empty', () => {
      const issueBody = `
      ## Reproduction
      The quick brown fox jumps over the lazy dog
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(false);
    });

    it('should ignore comments', () => {
      const issueBody = `
      ## Reproduction

      <!--A comment-->
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(true);
    });

    it('should ignore multiline comments', () => {
      const issueBody = `
      ## Reproduction

      <!--
      A comment
      -->
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(true);
    });
  });
});
