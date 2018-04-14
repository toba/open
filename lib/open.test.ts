import '@toba/test';
import { isWindowsBash } from './is-wsl';
import { Platform } from './types';
import { open } from '../';

const testURL = 'http://trailimage.com';
let chromeName: string;

const isDesktop: boolean = process.env['IS_LOCAL_DESKTOP'] === '1';

if (process.platform === Platform.MacOS) {
   chromeName = 'google chrome canary';
} else if (process.platform === Platform.Windows32 || isWindowsBash) {
   chromeName = 'Chrome';
} else if (process.platform === Platform.Linux) {
   chromeName = 'google-chrome';
}

// Tests only checks that opening doesn't return an error. They have no way to
// ensure target actually opened.

if (isDesktop) {
   test('Open file in default app', async () => {
      const cp = await open(__dirname + '/open.ts');
      expect(cp).toBeDefined();
      expect(cp.killed).toBe(false);
   });

   test('Has option to not wait for opener to finish', async () => {
      const cp = await open(testURL, { wait: false });
      expect(cp).toBeDefined();
   });

   test('Open url in specified app with arguments', async () => {
      const cp = await open(testURL, { app: [chromeName, '--incognito'] });
      expect(cp).toBeDefined();
   });
} else {
   test('Skips file and URL opening tests if not running locally', () => {
      expect(isDesktop).toBe(false);
   });
}
