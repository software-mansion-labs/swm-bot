const DateComparator = require('./DateComparator');

describe('DateComparator', () => {
  describe('isDateBefore', () => {
    it('should return true when first date is before the second', () => {
      const dateComparator = new DateComparator();
      const d1 = '2022-01-01T20:33:15Z';
      const d2 = '2022-01-03T14:32:34Z';
      expect(dateComparator.isDateBefore(d1, d2)).toBe(true);
    });

    it('should return false when first date is after the second', () => {
      const dateComparator = new DateComparator();
      const d1 = '2022-01-01T20:33:15Z';
      const d2 = '2021-12-21';
      expect(dateComparator.isDateBefore(d1, d2)).toBe(false);
    });

    it('should work correctly when date is without hours', () => {
      const dateComparator = new DateComparator();
      const d1 = '2022-01-01';
      const d2 = '2021-12-21';
      expect(dateComparator.isDateBefore(d1, d2)).toBe(false);
    });

    it('should work correctly when date is without hours', () => {
      const dateComparator = new DateComparator();
      const d1 = '2021-12-21';
      const d2 = '2022-01-01';
      expect(dateComparator.isDateBefore(d1, d2)).toBe(true);
    });
  });
});
