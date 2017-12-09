#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("npmlog");
var yargs = require("yargs");
log.heading = 'elm-eos';
log.addLevel('debug', 2980, { fg: 'white' });
log.addLevel('success', 3001, { fg: 'green', bold: true });
if (!module.parent) {
    yargs
        .commandDir('cmds')
        .demandCommand()
        .help()
        .argv;
}
