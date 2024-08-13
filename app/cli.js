#!/usr/bin/env node

import {log} from '@k03mad/simple-log';
import chalk from 'chalk';
import {table} from 'table';

import * as api from './api.js';

const {green, dim, magenta} = chalk;

const args = new Set(process.argv.slice(2));

const isArgHelp = args.has('-h') || args.has('--help');
const isArgAll = args.has('-a') || args.has('--all');
const isArgJson = args.has('-j') || args.has('--json');
const isArgFormat = args.has('-f') || args.has('--format');

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
        `${cmd} -o               ${dim('# js object: every last major versions')}`,
        `${cmd} --object         ${dim('# js object: every last major versions')}`,
        '',
        `${cmd} -a -o            ${dim('# js object: all parsed versions')}`,
        `${cmd} --all --object   ${dim('# js object: all parsed versions')}`,
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
} else if (isArgFormat) {
    log([versions]);
} else {
    const formattedTable = table(
        versions
            .reverse()
            .map(({version, date, name}) => [
                green(version),
                dim(date),
                name ? magenta(name) : '',
            ]),
    );

    log(formattedTable);
}
