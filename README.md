# Get NodeJS versions

![screenshot](https://github.com/k03mad/nodejs-versions/blob/master/screenshot.png?raw=true)

## CLI

```bash
npm i @k03mad/nodejs-versions -g

# only major
nodever
# ╟───────────┼────────────┼──────────┼─────────┼─────────────┼────────┼────────────────┼─────────────╢
# ║ v20.16.0  │ 2024-07-24 │ Iron     │ 10.8.1  │ 11.3.244.8  │ 1.46.0 │ 1.3.0.1-motley │ 3.0.13+quic ║
# ╟───────────┼────────────┼──────────┼─────────┼─────────────┼────────┼────────────────┼─────────────╢
# ║ v21.7.3   │ 2024-04-10 │          │ 10.5.0  │ 11.8.172.17 │ 1.48.0 │ 1.3.0.1-motley │ 3.0.13+quic ║
# ╟───────────┼────────────┼──────────┼─────────┼─────────────┼────────┼────────────────┼─────────────╢
# ║ v22.6.0   │ 2024-08-06 │          │ 10.8.2  │ 12.4.254.21 │ 1.48.0 │ 1.3.0.1-motley │ 3.0.13+quic ║
# ╟───────────┼────────────┼──────────┼─────────┼─────────────┼────────┼────────────────┼─────────────╢
# ║ nodejs    │ date       │ lts      │ npm     │ v8          │ uv     │ zlib           │ openssl     ║
# ╚═══════════╧════════════╧══════════╧═════════╧═════════════╧════════╧════════════════╧═════════════╝

# all versions
nodever -a
nodever --all
# json output
nodever -j
nodever --json
```

## API

```bash
npm i @k03mad/nodejs-versions
```

```js
import {
    getNodeJsAllVersions,
    getNodeJsMajorVersions,
} from '@k03mad/nodejs-versions';

const allVersions = await getNodeJsAllVersions();
const majorVersions = await getNodeJsMajorVersions();

// [
//   {
//     version: 'v22.6.0',
//     date: '2024-08-06',
//     files: [
//       'aix-ppc64',     'headers',
//       'linux-arm64',   'linux-armv7l',
//       'linux-ppc64le', 'linux-s390x',
//       'linux-x64',     'osx-arm64-tar',
//       'osx-x64-pkg',   'osx-x64-tar',
//       'src',           'win-arm64-7z',
//       'win-arm64-zip', 'win-x64-7z',
//       'win-x64-exe',   'win-x64-msi',
//       'win-x64-zip',   'win-x86-7z',
//       'win-x86-exe',   'win-x86-msi',
//       'win-x86-zip'
//     ],
//     npm: '10.8.2',
//     v8: '12.4.254.21',
//     uv: '1.48.0',
//     zlib: '1.3.0.1-motley',
//     openssl: '3.0.13+quic',
//     modules: '127',
//     lts: false,
//     security: false,
//     extra: {
//         versionRaw: '22.6.0',
//         url: 'https://nodejs.org/dist/v22.6.0/
//     }
//   },
//   {
//     version: 'v21.7.3',
//     date: '2024-04-10',
//     ...
//   },
//   ...
// ]

```
