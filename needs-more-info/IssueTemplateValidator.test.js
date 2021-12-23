const IssueTemplateValidator = require('./IssueTemplateValidator');

describe('IssueTemplateValidator', () => {
  describe('_sectionExists', () => {
    it('should return false when issue body is empty', () => {
      const issueBody = ``;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._sectionExists('Reproduction')).toBe(false);
    });

    it('should return false when issue body is null', () => {
      const issueBody = null;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._sectionExists('Reproduction')).toBe(false);
    });

    it('should return false when issue body is undefined', () => {
      const issueBody = undefined;
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

    it('should return false when section is commented out but present in issue body', () => {
      const issueBody = `
      <!--
      ## Reproduction
      My great repro
      -->
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._sectionExists('Reproduction')).toBe(false);
    });
  });

  describe('_removeComments', () => {
    it('should return empty string when string consists only of html comments', () => {
      const str = `<!-- -->`;
      const issueTemplateValidator = new IssueTemplateValidator('', []);

      expect(issueTemplateValidator._removeComments(str)).toBe('');
    });

    it("should return text that's not between comments", () => {
      const str = `Hello<!-- -->`;
      const issueTemplateValidator = new IssueTemplateValidator('', []);

      expect(issueTemplateValidator._removeComments(str)).toBe('Hello');
    });

    it("should return text that's not between multiline comments", () => {
      const str = `Hello<!-- 
      Hidden
      -->`;
      const issueTemplateValidator = new IssueTemplateValidator('', []);

      expect(issueTemplateValidator._removeComments(str)).toBe('Hello');
    });

    it("should return text that's not between multiple multiline comments", () => {
      const str = `Hello<!-- 
      Hidden
      --><!-- Also hidden -->`;
      const issueTemplateValidator = new IssueTemplateValidator('', []);

      expect(issueTemplateValidator._removeComments(str)).toBe('Hello');
    });

    it('should return the same text when no comments are present', () => {
      const str = `Hello`;
      const issueTemplateValidator = new IssueTemplateValidator('', []);

      expect(issueTemplateValidator._removeComments(str)).toBe('Hello');
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

    it('should return true when section is null', () => {
      const issueBody = null;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(true);
    });

    it('should return true when section is undefined', () => {
      const issueBody = undefined;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(true);
    });

    it('should return true when section has less than 4 characters', () => {
      const issueBody = `
      ## Reproduction
      asd
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(true);
    });

    it('should return true when section has more than 4 characters', () => {
      const issueBody = `
      ## Reproduction
      No repro yet.
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator._isSectionEmpty('Reproduction')).toBe(false);
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

  describe('validate', () => {
    it('should return empty array when issue body has required sections', () => {
      const issueBody = `
      ## Reproduction
      The quick brown fox jumps over the lazy dog
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, ['Reproduction']);

      expect(issueTemplateValidator.validate()).toStrictEqual([]);
    });

    it('should return missing sections when issue body is missing these sections', () => {
      const issueBody = `
      ## Reproduction
      The quick brown fox jumps over the lazy dog
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, [
        'Reproduction',
        'Description',
        'Platform',
      ]);

      expect(issueTemplateValidator.validate()).toStrictEqual(['Description', 'Platform']);
    });

    it('should return missing sections when issue body is missing these sections', () => {
      const issueBody = `
      ## Reproduction
      The quick brown fox jumps over the lazy dog

      ## Description
      The quick brown fox jumps over the lazy dog
      `;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, [
        'Reproduction',
        'Description',
        'Platform',
      ]);

      expect(issueTemplateValidator.validate()).toStrictEqual(['Platform']);
    });

    it('should return missing sections when issue body is empty', () => {
      const issueBody = ``;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, [
        'Reproduction',
        'Description',
        'Platform',
      ]);

      expect(issueTemplateValidator.validate()).toStrictEqual([
        'Reproduction',
        'Description',
        'Platform',
      ]);
    });

    it('should return missing sections when issue body is null', () => {
      const issueBody = null;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, [
        'Reproduction',
        'Description',
        'Platform',
      ]);

      expect(issueTemplateValidator.validate()).toStrictEqual([
        'Reproduction',
        'Description',
        'Platform',
      ]);
    });

    it('should return missing sections when issue body is undefined', () => {
      const issueBody = undefined;
      const issueTemplateValidator = new IssueTemplateValidator(issueBody, [
        'Reproduction',
        'Description',
        'Platform',
      ]);

      expect(issueTemplateValidator.validate()).toStrictEqual([
        'Reproduction',
        'Description',
        'Platform',
      ]);
    });
  });
});
