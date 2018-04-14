import '@toba/test';
import * as fs from 'fs';
import { checkIsWSL } from './is-wsl';
import { Platform } from './types';

jest.mock('fs');

const fileProc = '/proc/version';
const wslProcVersion =
   'Linux version 3.4.0-Microsoft (Microsoft@Microsoft.com) (gcc version 4.7 (GCC) ) #1 SMP PREEMPT Wed Dec 31 14:42:53 PST 2014';

function setPlatform(platform: Platform | string) {
   Object.defineProperty(process, 'platform', { value: platform });
}

test('Reports true if platform is Linux but process version has "Windows"', () => {
   const p: string = process.platform;
   setPlatform(Platform.Linux);
   fs.__setFileContent(fileProc, wslProcVersion);
   expect(checkIsWSL()).toBe(true);
   setPlatform(p);
});

test('Reports false otherwise', () => {
   fs.__setFileContent(fileProc, '');
   expect(checkIsWSL()).toBe(false);
});
