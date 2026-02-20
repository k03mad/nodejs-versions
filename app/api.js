const NODE_VERSIONS_DIST = 'https://nodejs.org/dist/';
const NODE_VERSIONS_INDEX = `${NODE_VERSIONS_DIST}index.json`;

/**
 * @typedef {object} element
 * @property {string} version
 * @property {string} date
 * @property {string[]} files
 * @property {string} [npm]
 * @property {string} v8
 * @property {string} [uv]
 * @property {string} [zlib]
 * @property {string} [openssl]
 * @property {string} [modules]
 * @property {boolean} [lts]
 * @property {boolean} security
 * @property {object} extra
 * @property {string} extra.versionRaw
 * @property {string} extra.url
 */

/**
 * @returns {Promise<Array<element>>}
 */
export const getNodeJsAllVersions = async () => {
    const response = await fetch(NODE_VERSIONS_INDEX);
    const json = await response.json();

    return json.map(elem => ({
        ...elem,
        extra: {
            versionRaw: elem.version.replace('v', ''),
            url: `${NODE_VERSIONS_DIST + elem.version}/`,
        },
    }));
};

/**
 * @returns {Promise<Array<element>>}
 */
export const getNodeJsMajorVersions = async () => {
    const versions = await getNodeJsAllVersions();

    let currentMajor;

    return versions.filter(elem => {
        const majorVersion = elem.version.split('.')[0];

        if (currentMajor !== majorVersion) {
            currentMajor = majorVersion;
            return true;
        }
    });
};
