[![npm package](https://img.shields.io/npm/v/@toba/open.svg)](https://www.npmjs.org/package/@toba/open)
[![Build Status](https://travis-ci.org/toba/open.svg?branch=master)](https://travis-ci.org/toba/open)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Dependencies](https://img.shields.io/david/toba/open.svg)](https://david-dm.org/toba/open)
[![DevDependencies](https://img.shields.io/david/dev/toba/open.svg)](https://david-dm.org/toba/open#info=devDependencies&view=list)
[![codecov](https://codecov.io/gh/toba/open/branch/master/graph/badge.svg)](https://codecov.io/gh/toba/open)

# @toba/open

A TypeScript copy of [sindresorhus/opn](https://github.com/sindresorhus/opn). The following documentation is adapted from `opn`:

> A better [node-open](https://github.com/pwnall/node-open). Opens stuff like websites, files, executables. Cross-platform.

#### Why?

*  Actively maintained
*  Supports app arguments
*  Safer as it uses `spawn` instead of `exec`
*  Fixes most of the open `node-open` issues
*  Includes the latest [`xdg-open` script](http://cgit.freedesktop.org/xdg/xdg-utils/commit/?id=c55122295c2a480fa721a9614f0e2d42b2949c18) for Linux

## Install

```bash
$ yarn add '@toba/open'
```

## Usage

```ts
import open = from '@toba/open';

// Opens the image in the default image viewer
open('unicorn.png').then(() => {
	// image viewer closed
});

// Opens the url in the default browser
open('http://trailimage.com');

// Specify the app to open in
open('http://trailimage.com', {app: 'firefox'});

// Specify app arguments
open('http://trailimage.com', {app: ['google chrome', '--incognito']});
```

## API

Uses the command `open` on macOS, `start` on Windows and `xdg-open` on other platforms.

### open(target, [options])

Returns a promise for the [spawned child process](https://nodejs.org/api/child_process.html#child_process_class_childprocess). You would normally not need to use this for anything, but it can be useful if you'd like to attach custom event listeners or perform other operations directly on the spawned process.

#### target

Type: `string`

The thing you want to open. Can be a URL, file, or executable.

Opens in the default app for the file type. For example, URLs opens in your default browser.

#### options

Type: `Object`

##### wait

Type: `boolean`<br>
Default: `true`

Wait for the opened app to exit before fulfilling the promise. If `false` it's fulfilled immediately when opening the app.

On Windows you have to explicitly specify an app for it to be able to wait.

##### app

Type: `string` `Array`

Specify the app to open the `target` with, or an array with the app and app arguments.

The app name is platform dependent. Don't hard code it in reusable modules. For example, Chrome is `google chrome` on macOS, `google-chrome` on Linux and `chrome` on Windows.

## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
