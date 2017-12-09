import * as chokidar from 'chokidar';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import * as globby from 'globby';
import * as log from 'npmlog';
import * as path from 'path';
import * as yargs from 'yargs';
import * as util from '../../util';

export const command = 'static';

export const describe = 'Copies and optimizes static files';

export const builder = util.buildOptions;

export async function handler(args: yargs.Arguments) {
    await build(args);
    if (args.watch) {
        await watch(args);
    }
}

async function build(args: yargs.Arguments) {
    const glob = util.src(args, 'static', '*');
    const srcPaths = await globby(glob);
    await Promise.all(srcPaths.map(srcPath => {
        const name = path.relative(util.src(args, 'static'), srcPath);
        const distPath = util.dist(args, name);
        console.log({ name, distPath });
        return fs.copy(srcPath, distPath);
    }));
}

async function watch(args: yargs.Arguments) {
    chokidar
        .watch(util.src(args, 'static', '**', '*'))
        .on('change', () => build(args));
}
