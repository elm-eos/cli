import * as execa from 'execa';
import * as path from 'path';
import * as os from 'os';
import * as util from '../util';

export const command = 'run <elmFile>';
export const desc = 'Runs an Elm file in Node';
export const builder = { };

export async function handler(argv) {
    const outFile = `elm-${guid()}.js`;
    const outPath = path.join(os.tmpdir())
    await execa('elm-make', [argv.elmFile, '--yes', '--warn', '--output', outPath]);
    const Elm = require(outPath);
    Elm.Main.worker();
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
