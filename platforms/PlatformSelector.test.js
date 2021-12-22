const PlatformSelector = require('./PlatformSelector');

describe('PlatformSelector', () => {
  describe('_getPlatforms', () => {
    it('should return platforms passed to parser', () => {
      const issueBody = ``;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector._getPlatforms()).toStrictEqual(['Android', 'iOS', 'Web']);
    });
  });

  describe('_getPlatformLabels', () => {
    it('should return label platforms passed to parser', () => {
      const issueBody = ``;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector._getPlatformLabels()).toStrictEqual(['🤖android', '🍎iOS', '🧭web']);
    });
  });

  describe('selectLabelsToAdd', () => {
    it('should return empty array when issue body is empty', () => {
      const issueBody = ``;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toStrictEqual([]);
    });

    it('should return empty array when issue body is null', () => {
      const issueBody = null;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toStrictEqual([]);
    });

    it('should return empty array when issue body is undefined', () => {
      const issueBody = undefined;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toStrictEqual([]);
    });

    it('should return empty array when no platform is selected', () => {
      const issueBody = `
      - [ ] iOS
      - [ ] Android
      - [ ] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toStrictEqual([]);
    });

    it('should return correct label when a platform is selected', () => {
      const issueBody = `
      - [x] iOS
      - [ ] Android
      - [ ] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toStrictEqual(['🍎iOS']);
    });

    it('should return correct labels when platforms are selected', () => {
      const issueBody = `
      - [x] iOS
      - [x] Android
      - [ ] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toEqual(['🍎iOS', '🤖android']);
    });

    it('should return correct labels when platforms are selected', () => {
      const issueBody = `
      - [x] iOS
      - [x] Android
      - [x] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toEqual(['🍎iOS', '🤖android', '🧭web']);
    });

    it('should return correct labels when platforms are selected', () => {
      const issueBody = `
      - [ ] iOS
      - [x] Android
      - [x] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toEqual(['🤖android', '🧭web']);
    });
    it('should return correct labels when platforms are selected even if whitespace is added in checkboxes', () => {
      const issueBody = `
      - [ ] iOS
      - [x ] Android
      - [ x] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToAdd()).toEqual(['🤖android', '🧭web']);
    });
  });

  describe('selectLabelsToRemove', () => {
    it('should return array with all labels when issue body is empty', () => {
      const issueBody = ``;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual(
        expect.arrayContaining(['🍎iOS', '🤖android', '🧭web'])
      );
    });

    it('should return array with all labels when issue body is null', () => {
      const issueBody = null;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual(
        expect.arrayContaining(['🍎iOS', '🤖android', '🧭web'])
      );
    });

    it('should return array with all labels when issue body is undefined', () => {
      const issueBody = undefined;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual(
        expect.arrayContaining(['🍎iOS', '🤖android', '🧭web'])
      );
    });

    it('should return array with all labels when no platform is selected', () => {
      const issueBody = `
      - [ ] iOS
      - [ ] Android
      - [ ] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual(
        expect.arrayContaining(['🍎iOS', '🤖android', '🧭web'])
      );
    });

    it('should return labels which platforms are not selected', () => {
      const issueBody = `
      - [x] iOS
      - [ ] Android
      - [ ] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual(
        expect.arrayContaining(['🤖android', '🧭web'])
      );
    });

    it('should return labels which platforms are not selected', () => {
      const issueBody = `
      - [x] iOS
      - [x] Android
      - [ ] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual(['🧭web']);
    });

    it('should return empty array when all platforms are selected', () => {
      const issueBody = `
      - [x] iOS
      - [x] Android
      - [x] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual([]);
    });

    it('should return labels which platforms are not selected', () => {
      const issueBody = `
      - [ ] iOS
      - [x] Android
      - [x] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual(['🍎iOS']);
    });
    it('should return labels which platforms are not selected even if whitespace is added in checkboxes', () => {
      const issueBody = `
      - [ ] iOS
      - [x ] Android
      - [ x] Web
      `;
      const platformSelector = new PlatformSelector(
        issueBody,
        '{"Android": "🤖android", "iOS": "🍎iOS", "Web": "🧭web"}'
      );

      expect(platformSelector.selectLabelsToRemove()).toEqual(['🍎iOS']);
    });
  });
});
