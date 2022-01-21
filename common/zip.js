// Adopted from https://stackoverflow.com/a/22015930/9999202
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

module.exports = zip;
