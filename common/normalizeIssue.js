function normalizeIssue(str) {
  // Regex adopted from https://stackoverflow.com/a/57996414/9999202
  const withoutComments = str.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, '');
  const withoutDropdowns = withoutComments.replace(/<\/?(details|summary)>/g, '');
  return withoutDropdowns;
}

module.exports = normalizeIssue;
