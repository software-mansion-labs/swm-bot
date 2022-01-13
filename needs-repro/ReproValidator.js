const normalizeIssue = require('../common/normalizeIssue');

class ReproValidator {
  constructor(user) {
    this.user = user;
  }

  _hasSnackOrRepo(body) {
    const normalizedBody = normalizeIssue(body || '');

    // Code adopted from https://github.com/react-navigation/react-navigation/blob/main/.github/workflows/check-repro.yml#L22
    const regexp = new RegExp(
      `https?:\\/\\/((github\\.com\\/${this.user}\\/[^/]+\\/?\\s?)|(snack\\.expo\\.dev\\/([^\\s\\)\\]]+)))`,
      'gm'
    );
    return normalizedBody.search(regexp) !== -1;
  }

  // Heuristic way to guess with some confidence that a snippet has some JS/TS code
  _hasJavaScriptOrTypeScriptCode(body) {
    const normalizedBody = normalizeIssue(body || '');

    // Start with 0 certainty that is is a JS/TS repro
    let certainty = 0;

    // Assign arbitray threshold eg. 50%
    const CERTAINTY_THRESHOLD = 0.5;
    const WEIGHT_PER_TEST = 0.2;

    const safeTestConditions = [
      this._hasFunctions(normalizedBody),
      this._hasVariables(normalizedBody),
      this._hasImports(normalizedBody),
      this._hasExports(normalizedBody),
      this._hasJSX(normalizedBody),
    ];

    certainty += safeTestConditions.filter(Boolean).length / safeTestConditions.length;

    if (this._hasBackticks(normalizedBody)) {
      certainty += WEIGHT_PER_TEST / 2;
    }

    if (this._hasMethodInvocations(normalizedBody) && !this._hasAndroidStackTrace(normalizedBody)) {
      certainty += WEIGHT_PER_TEST;
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
    return this._hasJavaScriptOrTypeScriptCode(body) || this._hasSnackOrRepo(body);
  }
}

module.exports = ReproValidator;
