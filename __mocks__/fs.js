const fs = jest.genMockFromModule('fs');
const content = {};

fs.__setFileContent = function(path, text) {
   content[path] = text;
};

/**
 * Replace output to match `is-wsl#checkIsWSL()` condition for Windows Subsystem
 * for Linux.
 */
fs.readFileSync = path => content[path];

module.exports = fs;
