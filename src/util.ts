import * as fs from 'fs-extra';
import * as log from 'npmlog';
import * as path from 'path';
import * as yargs from 'yargs';

export const folderOptions = {
    root: {
        type: 'string',
        default: process.cwd(),
    },
    src: {
        type: 'string',
        default: 'src',
    },
    build: {
        type: 'string',
        default: 'build',
    },
    dist: {
        type: 'string',
        default: 'dist',
    },
};

export const buildOptions = {
    watch: {
        type: 'boolean',
        default: false,
    },
    optimize: {
        type: 'boolean',
        default: false,
    },
    ...folderOptions,
};

export function src(args: yargs.Arguments, ...paths: string[]): string {
    return path.join(args.root, args.src, ...paths);
}

export function dist(args: yargs.Arguments, ...paths: string[]): string {
    return path.join(args.root, args.dist, ...paths);
}

export function build(args: yargs.Arguments, ...paths: string[]): string {
    return path.join(args.root, args.build, ...paths);
}

export async function ensureDirs(args) {
    await Promise.all([
        fs.ensureDir(src(args)),
        fs.ensureDir(build(args)),
        fs.ensureDir(dist(args)),
    ]);
}
