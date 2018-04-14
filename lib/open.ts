import { is } from '@toba/tools';
import * as path from 'path';
import * as childProcess from 'child_process';
import { isWindowsBash } from './is-wsl';
import { Platform } from './types';

export interface Options {
   /**
    * Whether to return a `Promise` that doesn't resolve until the opened target
    * is closed or has an error. Otherwise an immediately resolved `Promise` is
    * returned with a detached process having no event handlers.
    *
    * @see https://nodejs.org/api/child_process.html#child_process_options_detached
    */
   wait?: boolean;
   /**
    * Specific application to use to open the target followed by an optional
    * list of application parameters.
    */
   app?: string | string[];
}

const defaultOptions = {
   wait: true
};

/**
 * Open a URL or named file in its associated application and return the child
 * process that opened it.
 */
export function open(
   target: string,
   opts: Options = defaultOptions
): Promise<childProcess.ChildProcess> {
   /** OS-specific command to open the target */
   let cmd: string;
   /** Arguments supplied to optional launch application */
   let appArgs: string[] = [];
   /** Arguments supplied to OS */
   let args: string[] = [];
   /** Options for the spawned process */
   const spawnOpts: childProcess.SpawnOptions = {};

   if (is.array(opts.app)) {
      appArgs = opts.app.slice(1);
      opts.app = opts.app[0];
   }

   if (process.platform === Platform.MacOS) {
      cmd = 'open';

      if (opts.wait) {
         args.push('-W');
      }

      if (opts.app) {
         args.push('-a', opts.app);
      }
   } else if (process.platform === Platform.Windows32 || isWindowsBash) {
      cmd = 'cmd' + (isWindowsBash ? '.exe' : '');
      args.push('/c', 'start', '""', '/b');
      target = target.replace(/&/g, '^&');

      if (opts.wait) {
         args.push('/wait');
      }

      if (opts.app) {
         args.push(opts.app);
      }

      if (appArgs.length > 0) {
         args = args.concat(appArgs);
      }
   } else {
      if (opts.app) {
         cmd = opts.app;
      } else {
         cmd =
            process.platform === Platform.Android
               ? 'xdg-open'
               : path.join(__dirname, 'xdg-open');
      }

      if (appArgs.length > 0) {
         args = args.concat(appArgs);
      }

      if (!opts.wait) {
         // `xdg-open` will block the process unless stdio is ignored and it's
         // detached from the parent even if it's unref'd

         // https://nodejs.org/api/child_process.html#child_process_options_stdio
         spawnOpts.stdio = 'ignore';
         // https://nodejs.org/api/child_process.html#child_process_options_detached
         spawnOpts.detached = true;
      }
   }

   args.push(target);

   if (process.platform === Platform.MacOS && appArgs.length > 0) {
      args.push('--args');
      args = args.concat(appArgs);
   }

   const cp = childProcess.spawn(cmd, args, spawnOpts);

   if (opts.wait) {
      return new Promise((resolve, reject) => {
         cp.once('error', reject);

         cp.once('close', code => {
            if (code > 0) {
               reject(new Error('Exited with code ' + code));
               return;
            }

            resolve(cp);
         });
      });
   }

   // By default, the parent will wait for the detached child to exit. To
   // prevent the parent from waiting for a given subprocess, use the
   // `subprocess.unref()` method. Doing so will cause the parent's event loop
   // to not include the child in its reference count, allowing the parent to
   // exit independently of the child, unless there is an established IPC
   // channel between the child and parent.
   //
   // https://nodejs.org/api/child_process.html#child_process_options_detached
   cp.unref();

   return Promise.resolve(cp);
}
