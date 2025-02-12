<!-- This file is generated - DO NOT EDIT! -->
<!-- Please see: https://github.com/thi-ng/umbrella/blob/develop/CONTRIBUTING.md#changes-to-readme-files -->
> [!IMPORTANT]
> ‼️ Announcing the thi.ng user survey 2024 📋
>
> [Please participate in the survey here!](https://forms.gle/XacbSDEmQMPZg8197)\
> (open until end of February)
>
> **To achieve a better sample size, I'd highly appreciate if you could
> circulate the link to this survey in your own networks.**
>
> [Discussion](https://github.com/thi-ng/umbrella/discussions/447)

# ![@thi.ng/intervals](https://media.thi.ng/umbrella/banners-20230807/thing-intervals.svg?86016315)

[![npm version](https://img.shields.io/npm/v/@thi.ng/intervals.svg)](https://www.npmjs.com/package/@thi.ng/intervals)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/intervals.svg)
[![Mastodon Follow](https://img.shields.io/mastodon/follow/109331703950160316?domain=https%3A%2F%2Fmastodon.thi.ng&style=social)](https://mastodon.thi.ng/@toxi)

> [!NOTE]
> This is one of 189 standalone projects, maintained as part
> of the [@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo
> and anti-framework.
>
> 🚀 Help me to work full-time on these projects by [sponsoring me on
> GitHub](https://github.com/sponsors/postspectacular). Thank you! ❤️

- [About](#about)
- [Status](#status)
    - [Breaking changes](#breaking-changes)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
- [Authors](#authors)
- [License](#license)

## About

Closed/open/semi-open interval data type, queries & operations.

Supports point & range queries and set operations with other intervals
(union, intersection, difference).

Furthermore, a parser for [ISO 80000-2 / ISO 31-11 interval
notation](https://en.wikipedia.org/wiki/ISO_31-11#Sets) is provided. See
[`parse()`](https://docs.thi.ng/umbrella/intervals/functions/parse.html) for
details.

## Status

**STABLE** - used in production

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Bintervals%5D+in%3Atitle)

#### Breaking changes

With version 3.0.0 the API has been updated to be largely functional rather than
OOP, with all static (and most instance) `Interval` methods converted into
standalone functions. The only class methods remaining are to implement these
standard interfaces: `ICompare`, `IContains`, `ICopy`, `IEquiv`.

## Installation

```bash
yarn add @thi.ng/intervals
```

ES module import:

```html
<script type="module" src="https://cdn.skypack.dev/@thi.ng/intervals"></script>
```

[Skypack documentation](https://docs.skypack.dev/)

For Node.js REPL:

```js
const intervals = await import("@thi.ng/intervals");
```

Package sizes (brotli'd, pre-treeshake): ESM: 1.61 KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/dlogic](https://github.com/thi-ng/umbrella/tree/develop/packages/dlogic)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/develop/packages/errors)

## Usage examples

One project in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory is using this package:

| Screenshot                                                                                                           | Description                                                      | Live demo                                           | Source                                                                           |
|:---------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------|:----------------------------------------------------|:---------------------------------------------------------------------------------|
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/pixel-sorting.png" width="240"/> | Interactive pixel sorting tool using thi.ng/color & thi.ng/pixel | [Demo](https://demo.thi.ng/umbrella/pixel-sorting/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/pixel-sorting) |

## API

[Generated API docs](https://docs.thi.ng/umbrella/intervals/)

```ts
// [0 .. +∞] (fully closed)
a = withMin(0);

// [-∞ .. 1) (open on RHS)
b = withMax(1, true);

i = intersection(a, b);
i.toString();
// [0 .. 1)

// parse from string
interval("[0 .. 1)")
// Interval { l: 0, r: 1, lopen: false, ropen: true }

contains(i, 1);
// or
i.contains(1);
// false (because interval is open on RHS)

contains(i, 0.999999);
// true

// classify interval relative to point (true if RHS < x)
isBefore(i, -1)
// false

isBefore(i, 1)
// true

// classify interval relative to point (true if LHS > x)
isAfter(i, -1);
// true

isAfter(i, 1);
// false

// grow interval to include 2 => [0 ... 2]
i2 = include(i, 2);

// sort order: LHS -> RHS
compare(i, i2);
// -1

// classify WRT given interval arg
// returns Classifier enum
classify(i, infinity());
// 3 (aka Classifier.SUBSET)

// create transformed interval
// (here scaled around centroid)
transform(i, (x) => x + (x - centroid(i)) * 2).toString();
// [-1 .. 2)

// iterator of decimated interval values
[...values(i, 0.25)];
// [ 0, 0.25, 0.5, 0.75 ]

// close RHS
i.ropen = false;

// iterator of 0.25-spaced values in interval
[...values(i, 0.25)];
// [ 0, 0.25, 0.5, 0.75, 1 ] => now includes 1

// iterator of n equidistant samples
[...samples(i, 4)]
// [ 0, 0.3333333333333333, 0.6666666666666666, 1 ]

// constrain values to interval (taking openness into account)
max(interval("(0..1)"), -2)
// 0.000001

// if given value is outside interval, uses opt epsilon value
// to return closest inside value (default: 1e-6)...
max(interval("(0..1)"), -2, 1e-3)
// 0.001

min(interval("(0..1)"), 2, 1e-3)
// 0.999

// clamp on both sides
clamp(interval("[0..1)"), -2, 1e-3)
// 0
clamp(interval("[0..1)"), 2, 1e-3)
// 0.999
```

## Authors

- [Karsten Schmidt](https://thi.ng) (Main author)
- [@oljeger](https://github.com/oljeger)

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-intervals,
  title = "@thi.ng/intervals",
  author = "Karsten Schmidt and others",
  note = "https://thi.ng/intervals",
  year = 2018
}
```

## License

&copy; 2018 - 2024 Karsten Schmidt // Apache License 2.0
