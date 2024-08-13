import cp from 'node:child_process';
import {before, describe, it} from 'node:test';
import {promisify} from 'node:util';

import {expect} from 'chai';

import {OUTPUT_ALL_INCLUDES, OUTPUT_MAJOR_INCLUDES} from './utils/test-data.js';

const cliFile = process.env.npm_package_bin_nodever;
const exec = promisify(cp.exec);

const ALL_ARGS = [
    '-a',
    '--all',
    '-a -j',
    '--all --json',
    '-a -o',
    '--all --object',
];

const MAJOR_ARGS = [
    '-j',
    '--json',
    '-o',
    '--object',
];

describe('cli', () => {
    let outputAllArgs, outputMajorArgs;

    before(async () => {
        [
            outputAllArgs,
            outputMajorArgs,
        ] = await Promise.all([
            Promise.all(ALL_ARGS.map(elem => exec(`${cliFile} ${elem}`))),
            Promise.all(MAJOR_ARGS.map(elem => exec(`${cliFile} ${elem}`))),
        ]);
    });

    ALL_ARGS.forEach((arg, i) => {
        describe(arg, () => {
            OUTPUT_MAJOR_INCLUDES.forEach(elem => {
                Object.values(elem).forEach(data => {
                    it(data, () => expect(outputAllArgs[i].stdout).to.include(data));
                });
            });

            OUTPUT_ALL_INCLUDES.forEach(elem => {
                Object.values(elem).forEach(data => {
                    it(data, () => expect(outputAllArgs[i].stdout).to.include(data));
                });
            });
        });
    });

    MAJOR_ARGS.forEach((arg, i) => {
        describe(arg, () => {
            OUTPUT_MAJOR_INCLUDES.forEach(elem => {
                Object.values(elem).forEach(data => {
                    it(data, () => expect(outputMajorArgs[i].stdout).to.include(data));
                });
            });

            OUTPUT_ALL_INCLUDES.forEach(elem => {
                Object.values(elem).forEach(data => {
                    it(data, () => expect(outputMajorArgs[i].stdout).not.to.include(data));
                });
            });
        });
    });
});
