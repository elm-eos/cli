import * as browserify from 'browserify';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as execa from 'execa';
import * as globby from 'globby';
import * as log from 'npmlog';
import * as path from 'path';
import * as swPrecache from 'sw-precache';
import * as yargs from 'yargs';
import * as uglifyify from 'uglifyify';
import * as watchify from 'watchify';
import * as util from '../../util';

export const command = 'js';

export const describe = 'Builds JS files';

export const builder = util.buildOptions;

export async function handler(args: yargs.Arguments) {
    await fs.emptyDir(path.join(args.root, 'node_modules', '~elm'));
    await buildElm(args);
    if (args.watch) {
        watchElm(args);
    }
    await buildBundles(args);
    if (args.optimize) {
        await buildSwCache(args);
    }
}

async function buildElm(args: yargs.Arguments) {
    const glob = util.src(args, '**', 'Main.elm');
    const srcPaths = await globby(glob);

    if (srcPaths.length === 0) {
        log.error(command, `No Elm files found with glob: ${glob}`);
        return;
    } else {
        log.info(command, 'Found Elm files:', srcPaths);
    }

    await Promise.all(srcPaths.map(async srcPath => {
        const dirName = path.dirname(path.relative(util.src(args), srcPath));
        const outPath = path.join(args.root, 'node_modules', '~elm', dirName, 'Main.js');
        await fs.ensureDir(path.dirname(outPath));
        return execa('elm-make', [srcPath, '--yes', '--warn', '--output', outPath]);
    }));
}

function watchElm(args: yargs.Arguments) {
    chokidar
        .watch(util.src(args, '**', '*.elm'))
        .on('change', () => buildElm(args));
}

async function buildSwCache(args: yargs.Arguments) {
    const outName = 'service-worker';
    await swPrecache.write(util.dist(args, `${outName}.js`), {
        staticFileGlobs: [util.dist(args, '**', `!(${outName}).@(html|css|js)`)],
        stripPrefix: util.dist(args) + path.sep,
    });
    log.success(command, 'Built ServiceWorker cache');
}

async function buildBundles(args: yargs.Arguments) {
    const glob = util.src(args, '**', '*.bundle.js');
    const srcPaths = await globby(glob);

    if (srcPaths.length === 0) {
        log.error(command, `No JS files found with glob: ${glob}`);
        return;
    } else {
        log.info(command, 'Found JS files:', srcPaths);
    }

    await Promise.all(srcPaths.map(srcPath => {
        const { bundle } = buildBundler(args, srcPath);
        return bundle();
    }));
}

function buildBundler(args: yargs.Arguments, srcPath: string) {
    const bundler = browserify({
        entries: [srcPath],
        cache: {},
        packageCache: {},
    });

    if (args.optimize) {
        bundler.transform(uglifyify, { global: true });
    }

    bundler.on('error', e => log.error(command, 'error bundling js', e.toString()));
    bundler.on('log', msg => log.success(command, 'bundle created', msg));

    const baseName = path.basename(srcPath, '.bundle.js');

    async function bundle() {
        return new Promise(async (resolve, reject) => {
            await util.ensureDirs(args);
            const inPath = util.build(args, `${baseName}.js`);
            const file = fs.createWriteStream(inPath);
            bundler.on('error', reject);
            file.on('error', reject);
            file.on('finish', async () => {
                await fs.copy(inPath, util.dist(args, `${baseName}.js`));
                resolve();
            });
            bundler.bundle().pipe(file);
        });
    }

    if (args.watch) {
        bundler.plugin(watchify);
        bundler.on('update', bundle);
    }

    return {
        bundler,
        bundle,
    };
}
