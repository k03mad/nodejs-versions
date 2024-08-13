import {requestCache} from '@k03mad/request';
import {JSDOM} from 'jsdom';

const NODE_VERSIONS_URL = 'https://nodejs.org/dist/';
const NODE_VERSION_RE = /^v([\d.]+)/;

const NODE_LTS_NAME_RE = /^latest-(\w+)\/$/;
const NODE_LTS_VERSION_RE = /^node-v([\d.]+)-/;

const NODE_DATE_RE = /(.+\d+:\d+)/;

const NODE_VERSION_DELIMITER = '.';
const NODE_VERSION_DELIMITER_COUNT = 2;

/**
 * @typedef hrefElement
 * @property {string} href
 * @property {HTMLAnchorElement} elem
 */

/**
 * @typedef apiOutput
 * @property {string} version
 * @property {string} date
 * @property {string} [name]
 */

/**
 * @param {string} body
 * @returns {Array<hrefElement>}
 */
const getPageHrefElems = body => {
    const dom = new JSDOM(body);
    return [...dom.window.document.querySelectorAll('a')]
        .map(elem => ({href: elem.getAttribute('href'), elem}));
};

/**
 * @param {Array<hrefElement>} hrefElements
 * @returns {Array<{version: string, date: string}>}
 */
const getAllVersionsAndDates = hrefElements => hrefElements
    .map(({elem, href}) => {
        const version = href.match(NODE_VERSION_RE)?.[1];

        if (version) {
            const date = elem.nextSibling.textContent.match(NODE_DATE_RE)?.[1]?.trim();

            if (date) {
                return {version, date};
            }
        }
    })
    .filter(Boolean)
    .sort((a, b) => {
        const first = a.version.split(NODE_VERSION_DELIMITER);
        const second = b.version.split(NODE_VERSION_DELIMITER);

        for (let i = 0; i <= NODE_VERSION_DELIMITER_COUNT; i++) {
            if (second[i] !== first[i]) {
                return Number(second[i]) - Number(first[i]);
            }
        }

        return 0;
    });

/**
 * @param {Array<hrefElement>} hrefElements
 * @returns {Promise<Array<{version: string, name: string}>>}
 */
const getLtsNamesAndVersions = async hrefElements => {
    const data = await Promise.all(
        hrefElements.map(async ({href: hrefMain}) => {
            const ltsName = hrefMain.match(NODE_LTS_NAME_RE)?.[1];

            if (ltsName) {
                const {body: bodyLtsPath} = await requestCache(NODE_VERSIONS_URL + hrefMain);

                const aElementsLtsPath = [
                    ...new Set(
                        getPageHrefElems(bodyLtsPath)
                            .map(({href: hrefLtsPath}) => hrefLtsPath.match(NODE_LTS_VERSION_RE)?.[1])
                            .filter(Boolean),
                    ),
                ];

                return {version: aElementsLtsPath[0], name: ltsName};
            }
        }),
    );

    return data.filter(Boolean);
};

/**
 * @returns {Promise<Array<{apiOutput}>>}
 */
export const getNodeJsAllVersions = async () => {
    const {body: bodyMain} = await requestCache(NODE_VERSIONS_URL);
    const hrefElementsMain = getPageHrefElems(bodyMain);

    // get lts names + last lts versions
    const ltsVersions = await getLtsNamesAndVersions(hrefElementsMain);

    // get dates + versions
    const allVersions = getAllVersionsAndDates(hrefElementsMain);

    // merge
    return allVersions.map(elem => {
        for (const {name, version} of ltsVersions) {
            if (version === elem.version) {
                return {...elem, name};
            }
        }

        return elem;
    });
};

/**
 * @returns {Promise<Array<{apiOutput}>>}
 */
export const getNodeJsMajorVersions = async () => {
    const nodeJsVersions = await getNodeJsAllVersions();

    let currentMajor;

    return nodeJsVersions.filter(elem => {
        const majorVersion = elem.version.split(NODE_VERSION_DELIMITER)[0];

        if (currentMajor !== majorVersion) {
            currentMajor = majorVersion;
            return true;
        }
    });
};
