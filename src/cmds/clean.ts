import * as fs from 'fs-extra';
import * as globby from 'globby';
import * as log from 'npmlog';
import * as yargs from 'yargs';
import * as util from '../util';

export const command = 'clean';

export const describe = 'Cleans build artifacts and dependencies';

export const builder = {
    full: {
        desc: 'Full clean that also removes dependencies',
        type: 'boolean',
        default: false,
    },
    ...util.folderOptions,
};

export async function handler(args: yargs.Arguments) {
    const paths = [
        'build',
        'dist',
    ];

    if (args.full) {
        log.warn('Full clean enabled -- removing all dependencies');
        paths.push('elm-stuff', 'node_modules');
    }

    const fullPaths = await globby(paths);

    if (fullPaths.length === 0) {
        log.warn('No paths found to clean', paths);
        return;
    } else {
        log.debug('Found paths to clean', fullPaths);
    }

    await Promise.all(fullPaths.map(fp => fs.remove(fp)));
    await util.ensureDirs(args);
}
