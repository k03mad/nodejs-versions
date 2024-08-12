import cp from 'node:child_process';
import {before, describe, it} from 'node:test';
import {promisify} from 'node:util';

import {expect} from 'chai';

import {OUTPUT_ALL_INCLUDES, OUTPUT_MAJOR_INCLUDES} from './utils/test-data.js';

const cliFile = process.env.npm_package_bin_nodever;
const exec = promisify(cp.exec);

describe('cli', () => {
    let stdoutAllFullArg, stdoutAllShortArg, stdoutDefault;

    before(async () => {
        // cache
        ({stdout: stdoutDefault} = await exec(cliFile));

        [
            {stdout: stdoutAllFullArg},
            {stdout: stdoutAllShortArg},
        ] = await Promise.all([
            exec(`${cliFile} --all`),
            exec(`${cliFile} -a`),
        ]);
    });

    describe('major', () => {
        OUTPUT_MAJOR_INCLUDES.forEach(elem => {
            Object.values(elem).forEach(data => {
                it(data, () => expect(stdoutDefault).to.includes(data));
            });
        });

        OUTPUT_ALL_INCLUDES.forEach(elem => {
            Object.values(elem).forEach(data => {
                it(data, () => expect(stdoutDefault).not.to.includes(data));
            });
        });
    });

    describe('all full arg', () => {
        OUTPUT_MAJOR_INCLUDES.forEach(elem => {
            Object.values(elem).forEach(data => {
                it(data, () => expect(stdoutAllFullArg).to.includes(data));
            });
        });

        OUTPUT_ALL_INCLUDES.forEach(elem => {
            Object.values(elem).forEach(data => {
                it(data, () => expect(stdoutAllFullArg).to.includes(data));
            });
        });
    });

    describe('all short arg', () => {
        OUTPUT_MAJOR_INCLUDES.forEach(elem => {
            Object.values(elem).forEach(data => {
                it(data, () => expect(stdoutAllShortArg).to.includes(data));
            });
        });

        OUTPUT_ALL_INCLUDES.forEach(elem => {
            Object.values(elem).forEach(data => {
                it(data, () => expect(stdoutAllShortArg).to.includes(data));
            });
        });
    });
});
