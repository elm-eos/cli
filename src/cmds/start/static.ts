import * as browserSync from 'browser-sync';
import * as yargs from 'yargs';
import * as util from '../../util';

export const command = 'static';

export const describe = 'Starts a static web server';

export const builder = util.folderOptions;

export async function handler(args: yargs.Arguments) {
    const bs = browserSync.create();
    bs.init({
        files: [
            util.dist(args, '**', '*.*'),
        ],
        https: true,
        open: false,
        server: [util.dist(args)],
        middleware: [
            require('connect-history-api-fallback')(),
        ],
        reloadDebounce: 500,
    });
}
