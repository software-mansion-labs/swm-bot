const normalizeIssue = require('./normalizeIssue');

describe('normalizeIssue', () => {
  it('should return empty string when string consists only of html comments', () => {
    const str = `<!-- -->`;

    expect(normalizeIssue(str)).toBe('');
  });

  it("should return text that's not between comments", () => {
    const str = `Hello<!-- -->`;

    expect(normalizeIssue(str)).toBe('Hello');
  });

  it("should return text that's not between multiline comments", () => {
    const str = `Hello<!-- 
    Hidden
    -->`;

    expect(normalizeIssue(str)).toBe('Hello');
  });

  it("should return text that's not between multiple multiline comments", () => {
    const str = `Hello<!-- 
    Hidden
    --><!-- Also hidden -->`;

    expect(normalizeIssue(str)).toBe('Hello');
  });

  it('should return the same text when no comments are present', () => {
    const str = `Hello`;

    expect(normalizeIssue(str)).toBe('Hello');
  });

  it('should ignore markdown dropdown but leave content inside', () => {
    const str = `<details>Hello</details>`;

    expect(normalizeIssue(str)).toBe('Hello');
  });

  it('should ignore complex markdown dropdown but leave content inside', () => {
    const str = `<details>
    <summary>Heading</summary>
    Content inside dropdown
    </details>`;

    expect(normalizeIssue(str)).toBe(`
    Heading
    Content inside dropdown
    `);
  });
});
