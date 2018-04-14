const fs = jest.genMockFromModule('fs');
const wslProcVersion =
   'Linux version 3.4.0-Microsoft (Microsoft@Microsoft.com) (gcc version 4.7 (GCC) ) #1 SMP PREEMPT Wed Dec 31 14:42:53 PST 2014';

/**
 * Replace output to match `is-wsl#checkIsWSL()` condition for Windows Subsystem
 * for Linux.
 */
fs.readFileSync = () => wslProcVersion;

module.exports = fs;
