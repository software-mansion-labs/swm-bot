const MissingSectionsFormatter = require('./MissingSectionsFormatter');

describe('MissingSectionsFormatter', () => {
  describe('parse', () => {
    it('should parse semicolon separated list of sections to array', () => {
      const missingSectionsFormatter = new MissingSectionsFormatter();

      expect(
        missingSectionsFormatter.parse('Description;Steps To Reproduce;Reproduction;Platform')
      ).toStrictEqual(['Description', 'Steps To Reproduce', 'Reproduction', 'Platform']);

      expect(missingSectionsFormatter.parse('Description')).toStrictEqual(['Description']);
    });
  });

  describe('format', () => {
    it('should form a response when many invalid sections are provided', () => {
      const missingSectionsFormatter = new MissingSectionsFormatter();

      expect(
        missingSectionsFormatter.format('Hey!', [
          'Description',
          'Steps To Reproduce',
          'Reproduction',
        ])
      ).toBe(
        'Hey!\n\nPlease complete **Description**, **Steps To Reproduce** and **Reproduction** sections.'
      );

      expect(missingSectionsFormatter.format('Hey!', ['Description', 'Steps To Reproduce'])).toBe(
        'Hey!\n\nPlease complete **Description** and **Steps To Reproduce** sections.'
      );
    });

    it('should form a response when one invalid section is provided', () => {
      const missingSectionsFormatter = new MissingSectionsFormatter();

      expect(missingSectionsFormatter.format('Hey!', ['Description'])).toBe(
        'Hey!\n\nPlease complete **Description** section.'
      );
    });

    it('should return response when no invalid sections are provided', () => {
      const missingSectionsFormatter = new MissingSectionsFormatter();

      expect(missingSectionsFormatter.format('Hey!', [])).toBe('Hey!');
    });
  });
});
