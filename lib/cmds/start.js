"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = 'start <service>';
exports.desc = 'Starts services';
function builder(yargs) {
    return yargs.commandDir('start');
}
exports.builder = builder;
function handler(argv) { }
exports.handler = handler;
