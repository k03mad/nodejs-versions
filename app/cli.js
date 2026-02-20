#!/usr/bin/env node

import chalk from 'chalk';
import {table} from 'table';

import * as api from './api.js';

const {green, dim, magenta, bold} = chalk;

const checkArgsIncludes = flags =>
    process.argv
        .slice(2)
        .some(arg =>
            flags.some(flag =>
                flag.length > 1 ? arg === `--${flag}` : new RegExp(`^-[a-z]*${flag}`).test(arg),
            ),
        );

const isArgHelp = checkArgsIncludes(['help', 'h']);
const isArgAll = checkArgsIncludes(['all', 'a']);
const isArgJson = checkArgsIncludes(['json', 'j']);
const isArgSort = checkArgsIncludes(['date', 'd']);

if (isArgHelp) {
    const cmd = `${dim('$')} ${green('nodever')}`;

    console.log(
        [
            '',
            dim('# every last major version'),
            cmd,
            '',
            dim('# sort by release date'),
            `${cmd} -d`,
            `${cmd} --date`,
            '',
            dim('# all versions'),
            `${cmd} -a`,
            `${cmd} --all`,
            '',
            dim('# json output'),
            `${cmd} -j`,
            `${cmd} --json`,
            '',
            dim('# combine flags'),
            `${cmd} -ajd`,
        ].join('\n'),
    );

    process.exit(0);
}

const versions = isArgAll ? await api.getNodeJsAllVersions() : await api.getNodeJsMajorVersions();
const dateToNum = date => Number(date.replaceAll('-', ''));

if (isArgJson) {
    console.log(JSON.stringify(versions));
} else {
    const currentYear = new Date().getFullYear();

    const header = ['nodejs', 'date', 'lts', 'npm', 'v8', 'uv', 'zlib', 'openssl'].map(elem =>
        dim(bold(elem)),
    );

    const formattedVersions = [
        header,
        ...versions
            .toReversed()
            .toSorted((a, b) => {
                if (isArgSort) {
                    return dateToNum(a.date) - dateToNum(b.date);
                }

                return 0;
            })
            .map(elem => [
                green(elem.extra?.versionRaw || ''),
                elem.date?.startsWith(currentYear) ? elem.date : dim(elem.date || ''),
                magenta(elem.lts || ''),
                dim(elem.npm || ''),
                dim(elem.v8 || ''),
                dim(elem.uv || ''),
                dim(elem.zlib || ''),
                dim(elem.openssl || ''),
            ]),
        header,
    ];

    console.log(table(formattedVersions));
}
