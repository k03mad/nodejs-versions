#!/usr/bin/env node

import {log} from '@k03mad/simple-log';
import chalk from 'chalk';
import {table} from 'table';

import * as api from './api.js';

const {green, dim, magenta, bold} = chalk;

const args = new Set(process.argv.slice(2));

const isArgHelp = args.has('-h') || args.has('--help');
const isArgAll = args.has('-a') || args.has('--all');
const isArgJson = args.has('-j') || args.has('--json');

if (isArgHelp) {
    const cmd = `${dim('$')} ${green('nodever')}`;

    log([
        '',
        `${cmd}                  ${dim('# table: every last major versions')}`,
        '',
        `${cmd} -a               ${dim('# table: all parsed versions')}`,
        `${cmd} --all            ${dim('# table: all parsed versions')}`,
        '',
        `${cmd} -j               ${dim('# json: every last major versions')}`,
        `${cmd} --json           ${dim('# json: every last major versions')}`,
        '',
        `${cmd} -a -j            ${dim('# json: all parsed versions')}`,
        `${cmd} --all --json     ${dim('# json: all parsed versions')}`,
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

if (isArgJson) {
    log(JSON.stringify(versions));
} else {
    const currentYear = new Date().getFullYear();

    const header = [
        'nodejs',
        'date',
        'lts',
        'npm',
        'v8',
        'uv',
        'zlib',
        'openssl',
    ].map(elem => dim(bold(elem)));

    const formattedVersions = [
        header,
        ...versions
            .reverse()
            .map(elem => [
                elem.version ? green(elem.version) : '',
                elem.date?.startsWith(currentYear) ? elem.date : dim(elem.date || ''),
                elem.lts ? magenta(elem.lts) : '',
                elem.npm ? dim(elem.npm) : '',
                elem.v8 ? dim(elem.v8) : '',
                elem.uv ? dim(elem.uv) : '',
                elem.zlib ? dim(elem.zlib) : '',
                elem.openssl ? dim(elem.openssl) : '',
            ]),
        header,
    ];

    log(table(formattedVersions));
}
