function removeComments(str) {
  // Regex adopted from https://stackoverflow.com/a/57996414/9999202
  return str.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, '');
}

module.exports = removeComments;
