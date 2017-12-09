import * as yargs from 'yargs';
import * as buildHtml from './html';
import * as buildJs from './js';
import * as buildStatic from './static';
import * as util from '../../util';

export const command = 'all';

export const describe = 'Builds all files';

export const builder = util.buildOptions;

export async function handler(args: yargs.Arguments) {
    await Promise.all([
        buildHtml.handler(args),
        buildJs.handler(args),
        buildStatic.handler(args),
    ]);
}
