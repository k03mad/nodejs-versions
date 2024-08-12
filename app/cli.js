#!/usr/bin/env node

import {log} from '@k03mad/simple-log';
import chalk from 'chalk';
import {table} from 'table';

import * as api from './api.js';

const {green, dim} = chalk;

const args = new Set(process.argv.slice(2));

const isArgHelp = args.has('-h') || args.has('--help');
const isArgAll = args.has('-a') || args.has('--all');

if (isArgHelp) {
    const cmd = `${dim('$')} ${green('nodever')}`;

    log([
        '',
        `${cmd}       ${dim('# last major versions')}`,
        `${cmd} -a    ${dim('# all parsed versions')}`,
        `${cmd} --all ${dim('# all parsed versions')}`,
        '',
        `${cmd} -h`,
        `${cmd} --help`,
        '',
    ]);

    process.exit(0);
}

const versions = isArgAll
    ? await api.getNodeJsAllVersions()
    : await api.getNodeJsMajorVersions();

const formattedTable = table(
    versions
        .reverse()
        .map(({version, date}) => [
            green(version),
            dim(date),
        ]),
);

log(formattedTable);
