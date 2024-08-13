# Get NodeJS versions

## CLI

```bash
npm i @k03mad/nodejs-versions -g

# only major
nodever
# ╟──────────┼───────────────────┼──────────╢
# ║ 18.20.4  │ 08-Jul-2024 18:06 │ hydrogen ║
# ╟──────────┼───────────────────┼──────────╢
# ║ 19.9.0   │ 11-Apr-2023 00:29 │          ║
# ╟──────────┼───────────────────┼──────────╢
# ║ 20.16.0  │ 24-Jul-2024 12:09 │ iron     ║
# ╟──────────┼───────────────────┼──────────╢
# ║ 21.7.3   │ 10-Apr-2024 16:33 │          ║
# ╟──────────┼───────────────────┼──────────╢
# ║ 22.6.0   │ 06-Aug-2024 17:08 │          ║
# ╚══════════╧═══════════════════╧══════════╝

# json output
nodever --json
# for other options look at the help
nodever --help
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
// [
//   { version: '22.6.0', date: '06-Aug-2024 17:08' },
//   { version: '22.5.1', date: '19-Jul-2024 13:47' },
//   { version: '22.5.0', date: '17-Jul-2024 16:05' },
//   { version: '22.4.1', date: '08-Jul-2024 18:13' },
//   { version: '22.4.0', date: '02-Jul-2024 08:55' },
//   // ...
// ]

const majorVersions = await getNodeJsMajorVersions();
// [
//   { version: '22.6.0', date: '06-Aug-2024 17:08' },
//   { version: '21.7.3', date: '10-Apr-2024 16:33' },
//   { version: '20.16.0', date: '24-Jul-2024 12:09' },
//   { version: '19.9.0', date: '11-Apr-2023 00:29' },
//   { version: '18.20.4', date: '08-Jul-2024 18:06' },
//   // ...
// ]

```
