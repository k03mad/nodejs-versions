import {requestCache} from '@k03mad/request';

const NODE_VERSIONS_URL = 'https://nodejs.org/dist/index.json';

/**
 * @typedef {object} element
 * @property {string} version
 * @property {string} date
 * @property {string[]} files
 * @property {string} npm
 * @property {string} v8
 * @property {string} uv
 * @property {string} zlib
 * @property {string} openssl
 * @property {string} modules
 * @property {boolean} lts
 * @property {boolean} security
 */

/**
 * @returns {Promise<Array<element>>}
 */
export const getNodeJsAllVersions = async () => {
    const {body} = await requestCache(NODE_VERSIONS_URL);
    return body.map(elem => ({...elem, version: elem.version.replace('v', '')}));
};

/**
 * @returns {Promise<Array<element>>}
 */
export const getNodeJsMajorVersions = async () => {
    const versions = await getNodeJsAllVersions();

    let currentMajor;

    return versions.filter(elem => {
        const majorVersion = elem.version
            .split('.')[0];

        if (currentMajor !== majorVersion) {
            currentMajor = majorVersion;
            return true;
        }
    });
};
