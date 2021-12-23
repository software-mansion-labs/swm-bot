const removeComments = require('./removeComments');

describe('_removeComments', () => {
  it('should return empty string when string consists only of html comments', () => {
    const str = `<!-- -->`;

    expect(removeComments(str)).toBe('');
  });

  it("should return text that's not between comments", () => {
    const str = `Hello<!-- -->`;

    expect(removeComments(str)).toBe('Hello');
  });

  it("should return text that's not between multiline comments", () => {
    const str = `Hello<!-- 
    Hidden
    -->`;

    expect(removeComments(str)).toBe('Hello');
  });

  it("should return text that's not between multiple multiline comments", () => {
    const str = `Hello<!-- 
    Hidden
    --><!-- Also hidden -->`;

    expect(removeComments(str)).toBe('Hello');
  });

  it('should return the same text when no comments are present', () => {
    const str = `Hello`;

    expect(removeComments(str)).toBe('Hello');
  });
});
