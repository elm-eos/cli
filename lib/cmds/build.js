"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = 'build <filetype>';
exports.describe = 'Builds files';
function builder(yargs) {
    return yargs.commandDir('build');
}
exports.builder = builder;
function handler(argv) { }
exports.handler = handler;
