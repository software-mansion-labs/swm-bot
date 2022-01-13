const normalizeIssue = require('../common/normalizeIssue');

class ReproValidator {
  constructor(author, commenter) {
    this.author = author;
    this.commenter = commenter;
  }

  // Code adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-repro.yml#L22
  _hasRepo(body) {
    const normalizedBody = normalizeIssue(body || '');
    const regexp = new RegExp(
      `https?:\\/\\/github\\.com\\/(${this.author}|${this.commenter})\\/[^/]+\\/?\\s?`,
      'gm'
    );
    return normalizedBody.search(regexp) !== -1;
  }

  // Code adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-repro.yml#L22
  _hasSnack(body) {
    const normalizedBody = normalizeIssue(body || '');
    const regexp = /https?:\/\/snack\.expo\.dev\/[^\s)\]]+/gm;
    return normalizedBody.search(regexp) !== -1;
  }

  // Heuristic way to guess with some confidence that a snippet has some JS/TS code
  _hasCodeSnippet(body) {
    const normalizedBody = normalizeIssue(body || '');

    // Start with 0 certainty that is is a JS/TS repro
    let certainty = 0;

    // Assign arbitray threshold eg. 50%
    const CERTAINTY_THRESHOLD = 0.5;
    const WEIGHT = 0.2;

    const testConditions = [
      this._hasFunctions(normalizedBody),
      this._hasVariables(normalizedBody),
      this._hasJSX(normalizedBody),
    ];

    certainty += WEIGHT * testConditions.filter(Boolean).length;

    const strongTestConditions = [
      this._hasImports(normalizedBody),
      this._hasExports(normalizedBody),
    ];

    certainty += WEIGHT * strongTestConditions.filter(Boolean).length * 1.2;

    if (this._hasBackticks(normalizedBody)) {
      certainty += WEIGHT * 0.5;
    }

    if (this._hasMethodInvocations(normalizedBody) && !this._hasAndroidStackTrace(normalizedBody)) {
      certainty += WEIGHT;
    }

    return certainty >= CERTAINTY_THRESHOLD;
  }

  _hasFunctions(body) {
    const functionsRegex = /(function\s.*\(.*\)\s?{.*)|(\)\s?=>\s?)/gm;
    return (body || '').search(functionsRegex) !== -1;
  }

  _hasVariables(body) {
    const variablesRegex = /(const|let|var)\s\w+\s+=/gm;
    return (body || '').search(variablesRegex) !== -1;
  }

  _hasBackticks(body) {
    const backticksRegex = /```/gm;
    return (body || '').search(backticksRegex) !== -1;
  }

  _hasImports(body) {
    const importsRegex = /import\s.*from\s('|").*('|")/gm;
    return (body || '').search(importsRegex) !== -1;
  }

  _hasExports(body) {
    const exportsRegex = /export\s(const|var|let|function|default)/gm;
    return (body || '').search(exportsRegex) !== -1;
  }

  _hasJSX(body) {
    const jsxRegex = /(<\w+)|(<\/\w+>)/gm;
    return (body || '').search(jsxRegex) !== -1;
  }

  _hasMethodInvocations(body) {
    const methodInvocationsRegex = /\.\w+\(/gm;
    return (body || '').search(methodInvocationsRegex) !== -1;
  }

  // Android stack trace has Java code and triggers false-positive repro response
  _hasAndroidStackTrace(body) {
    const crashRegex =
      /((android\.\w+)|(com\.facebook.\w+)|(com\.swmansion.\w+)|(java\.lang.\w+))/gm;
    return (body || '').search(crashRegex) !== -1;
  }

  isReproValid(body) {
    return this._hasCodeSnippet(body) || this._hasSnack(body) || this._hasRepo(body);
  }
}

module.exports = ReproValidator;
