import { Encoding } from '@toba/tools';
import * as os from 'os';
import * as fs from 'fs';
import { Platform } from './types';

export const checkIsWSL = (): boolean => {
   if (process.platform !== Platform.Linux) {
      return false;
   }

   if (os.release().includes('Microsoft')) {
      return true;
   }

   try {
      return fs
         .readFileSync('/proc/version', Encoding.UTF8)
         .includes('Microsoft');
   } catch (err) {
      return false;
   }
};

/**
 * Whether process is running inside Windows Subsystem for Linux (Bash).
 * @see https://docs.microsoft.com/en-us/windows/wsl/about
 *
 * Copied from `sindresorhus/is-wsl`.
 * @see https://github.com/sindresorhus/is-wsl
 */
export const isWindowsBash = checkIsWSL();
