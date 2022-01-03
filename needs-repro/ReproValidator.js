const normalizeIssue = require('../common/normalizeIssue');

class ReproValidator {
  constructor(user) {
    this.user = user;
  }

  _hasSnackOrRepo(body) {
    const normalizedBody = normalizeIssue(body || '');

    // Code adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-repro.yml#L22
    const regexp = new RegExp(
      `https?:\\/\\/((github\\.com\\/${this.user}\\/[^/]+\\/?[\\s\\n]+)|(snack\\.expo\\.dev\\/.+))`,
      'gm'
    );
    return normalizedBody.search(regexp) !== -1;
  }

  // Heuristic way to guess with some confidence that a snippet has some JS/TS code
  _hasJavaScriptOrTypeScriptCode(body) {
    const normalizedBody = normalizeIssue(body || '');
    // This method is splitted into separate methods for easier testing
    const testConditions = [
      this._hasFunctions(normalizedBody),
      this._hasVariables(normalizedBody),
      this._hasBackticks(normalizedBody),
      this._hasImports(normalizedBody),
      this._hasExports(normalizedBody),
      this._hasJSX(normalizedBody),
    ];
    // Code adopted from https://stackoverflow.com/a/42317235/9999202
    const percentOfConditionsMet = testConditions.filter(Boolean).length / testConditions.length;

    return percentOfConditionsMet >= 0.5;
  }

  _hasFunctions(body) {
    const functionsRegex = /(function\s.*\(.*\)\s?{.*)|(\w+\(.*\))|(\)\s?=>\s?)/gm;
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

  isReproValid(body) {
    return this._hasJavaScriptOrTypeScriptCode(body) || this._hasSnackOrRepo(body);
  }
}

module.exports = ReproValidator;
