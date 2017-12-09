#!/usr/bin/env node
import * as log from 'npmlog';
import * as yargs from 'yargs';

log.heading = 'elm-eos';
log.addLevel('debug', 2980, { fg: 'white' });
log.addLevel('success', 3001, { fg: 'green', bold: true });

if (!module.parent) {
    (yargs as any)
        .commandDir('cmds')
        .demandCommand()
        .help()
        .argv;
}
