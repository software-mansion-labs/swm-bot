const MissingSectionsFormatter = require('./MissingSectionsFormatter');

describe('MissingSectionsFormatter', () => {
  describe('format', () => {
    it('should correctly parse when many invalid sections are provided', () => {
      const missingSectionsFormatter = new MissingSectionsFormatter();

      expect(
        missingSectionsFormatter.format('Hey!', [
          'Description',
          'Steps To Reproduce',
          'Reproduction',
        ])
      ).toBe(
        'Hey! It looks like sections Description, Steps To Reproduce and Reproduction are missing.'
      );

      expect(missingSectionsFormatter.format('Hey!', ['Description', 'Steps To Reproduce'])).toBe(
        'Hey! It looks like sections Description and Steps To Reproduce are missing.'
      );
    });

    it('should correctly parse when one invalid section is provided', () => {
      const missingSectionsFormatter = new MissingSectionsFormatter();

      expect(missingSectionsFormatter.format('Hey!', ['Description'])).toBe(
        'Hey! It looks like Description section is missing.'
      );
    });

    it('should return response when no invalid sections are provided', () => {
      const missingSectionsFormatter = new MissingSectionsFormatter();

      expect(missingSectionsFormatter.format('Hey!', [])).toBe('Hey!');
    });
  });
});
