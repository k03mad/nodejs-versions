import {before, describe, it} from 'node:test';

import {expect} from 'chai';

import {getNodeJsAllVersions, getNodeJsMajorVersions} from '../app/api.js';

import {OUTPUT_ALL_INCLUDES, OUTPUT_MAJOR_INCLUDES} from './utils/test-data.js';

describe('api', () => {
    let allVersions, majorVersions;

    before(async () => {
        // cache
        majorVersions = await getNodeJsMajorVersions();
        allVersions = await getNodeJsAllVersions();
    });

    describe('major', () => {
        OUTPUT_MAJOR_INCLUDES.forEach(elem => {
            it(Object.values(elem).join(), () => expect(majorVersions).to.deep.include(elem));
        });

        OUTPUT_ALL_INCLUDES.forEach(elem => {
            it(Object.values(elem).join(), () => expect(majorVersions).not.to.deep.include(elem));
        });
    });

    describe('all', () => {
        OUTPUT_MAJOR_INCLUDES.forEach(elem => {
            it(Object.values(elem).join(), () => expect(allVersions).to.deep.include(elem));
        });

        OUTPUT_ALL_INCLUDES.forEach(elem => {
            it(Object.values(elem).join(), () => expect(allVersions).to.deep.include(elem));
        });
    });
});
