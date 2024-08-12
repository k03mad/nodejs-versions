import {requestCache} from '@k03mad/request';
import {JSDOM} from 'jsdom';

const NODE_VERSIONS_URL = 'https://nodejs.org/dist/';
const NODE_VERSION_RE = /^v([\d.]+)/;
const NODE_DATE_RE = /(.+\d+:\d+)/;

const NODE_VERSION_DELIMITER = '.';
const NODE_VERSION_DELIMITER_COUNT = 2;

/** */
export const getNodeJsAllVersions = async () => {
    const {body} = await requestCache(NODE_VERSIONS_URL);
    const dom = new JSDOM(body);

    return [...dom.window.document.querySelectorAll('a')]
        .map(elem => {
            const version = elem.getAttribute('href').match(NODE_VERSION_RE)?.[1];

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
};

/** */
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
