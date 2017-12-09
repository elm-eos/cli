import * as chokidar from 'chokidar';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import * as globby from 'globby';
import * as log from 'npmlog';
import * as path from 'path';
import * as pug from 'pug';
import * as yargs from 'yargs';
import * as util from '../../util';

export const command = 'html';

export const describe = 'Compiles PUG files to the dist directory';

export const builder = util.buildOptions;

export async function handler(args: yargs.Arguments) {
    await build(args);
    if (args.watch) {
        await watch(args);
    }
}

async function build(args: yargs.Arguments) {
    await util.ensureDirs(args);
    const glob = util.src(args, '**', '*.bundle.pug');
    const srcPaths = await globby(glob);

    if (srcPaths.length === 0) {
        log.error(command, 'No .pug bundles found with glob:', glob);
        return;
    } else {
        log.info(command, `Found ${srcPaths.length} .pug bundle(s):`, srcPaths);
    }

    await Promise.all(srcPaths.map(async (srcPath) => {
        const dirName = path.dirname(path.relative(util.src(args), srcPath));
        await Promise.all([
            fs.ensureDir(util.build(args, dirName)),
            fs.ensureDir(util.dist(args, dirName)),
        ]);
        const fileName = path.basename(srcPath, '.bundle.pug');
        const buildPath = util.build(args, dirName, `${fileName}.html`);
        const distPath = util.dist(args, dirName, `${fileName}.html`);
        const getContents = pug.compileFile(srcPath, {
            pretty: !args.optimize,
        });
        fs.writeFileSync(buildPath, getContents());
        if (args.optimize) {
            await execa('html-minifier', ['-c', 'html-minifier.json', '-o', distPath, buildPath]);
        }

        await fs.copy(buildPath, distPath);
        log.success(command, 'Built pug file', distPath);
    }));
}

async function watch(args: yargs.Arguments) {
    chokidar
        .watch(util.src(args, '**', '*.pug'))
        .on('change', () => build(args));
}
