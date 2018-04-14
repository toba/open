import '@toba/test';
import { checkIsWSL } from './is-wsl';
import { Platform } from './types';

jest.mock('fs');

function setPlatform(platform: Platform | string) {
   Object.defineProperty(process, 'platform', { value: platform });
}

test('Reports true if platform is Linux but process version has "Windows"', () => {
   const p: string = process.platform;
   setPlatform(Platform.Linux);
   expect(checkIsWSL()).toBe(true);
   setPlatform(p);
});

test('Reports false otherwise', () => {
   jest.unmock('fs');
   expect(checkIsWSL()).toBe(false);
});
