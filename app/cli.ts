import chalk from 'chalk';
import {table} from 'table';

const {green, dim, magenta, bold} = chalk;

const NODE_VERSIONS_DIST = 'https://nodejs.org/dist/';
const NODE_VERSIONS_INDEX = `${NODE_VERSIONS_DIST}index.json`;

interface NodeJsVersionExtra {
  versionRaw: string;
  url: string;
}

interface NodeJsVersion {
  version: string;
  date: string;
  files: string[];
  npm?: string;
  v8: string;
  uv?: string;
  zlib?: string;
  openssl?: string;
  modules?: string;
  lts?: string | undefined;
  security: boolean;
  extra: NodeJsVersionExtra;
}

interface NodeJsVersionRaw {
  version: string;
  date: string;
  files: string[];
  npm?: string;
  v8: string;
  uv?: string;
  zlib?: string;
  openssl?: string;
  modules?: string;
  lts?: string | false;
  security: boolean;
}

const getNodeJsAllVersions = async (): Promise<NodeJsVersion[]> => {
  const response = await fetch(NODE_VERSIONS_INDEX);
  const json: NodeJsVersionRaw[] = await response.json();

  return json.map(elem => ({
    ...elem,
    lts: elem.lts === false ? undefined : elem.lts,
    extra: {
      versionRaw: elem.version.replace('v', ''),
      url: `${NODE_VERSIONS_DIST + elem.version}/`,
    },
  }));
};

const getNodeJsMajorVersions = async (): Promise<NodeJsVersion[]> => {
  const versions = await getNodeJsAllVersions();

  let currentMajor: string | undefined;

  return versions.filter(elem => {
    const majorVersion = elem.version.split('.')[0];

    if (currentMajor !== majorVersion) {
      currentMajor = majorVersion;
      return true;
    }

    return false;
  });
};

const checkArgsIncludes = (flags: string[]): boolean =>
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

const versions = isArgAll ? await getNodeJsAllVersions() : await getNodeJsMajorVersions();
const dateToNum = (date: string): number => Number(date.replaceAll('-', ''));

if (isArgJson) {
  console.log(JSON.stringify(versions));
} else {
  const currentYear = String(new Date().getFullYear());

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
        green(elem.extra?.versionRaw ?? ''),
        elem.date?.startsWith(currentYear) ? elem.date : dim(elem.date ?? ''),
        magenta(elem.lts ?? ''),
        dim(elem.npm ?? ''),
        dim(elem.v8 ?? ''),
        dim(elem.uv ?? ''),
        dim(elem.zlib ?? ''),
        dim(elem.openssl ?? ''),
      ]),
    header,
  ];

  console.log(table(formattedVersions));
}
