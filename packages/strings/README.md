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

# ![@thi.ng/strings](https://media.thi.ng/umbrella/banners-20230807/thing-strings.svg?41f4988c)

[![npm version](https://img.shields.io/npm/v/@thi.ng/strings.svg)](https://www.npmjs.com/package/@thi.ng/strings)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/strings.svg)
[![Mastodon Follow](https://img.shields.io/mastodon/follow/109331703950160316?domain=https%3A%2F%2Fmastodon.thi.ng&style=social)](https://mastodon.thi.ng/@toxi)

> [!NOTE]
> This is one of 189 standalone projects, maintained as part
> of the [@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo
> and anti-framework.
>
> 🚀 Help me to work full-time on these projects by [sponsoring me on
> GitHub](https://github.com/sponsors/postspectacular). Thank you! ❤️

- [About](#about)
  - [General](#general)
  - [Numeric formatters](#numeric-formatters)
  - [Casing](#casing)
  - [Slugify](#slugify)
  - [ANSI](#ansi)
  - [Word wrapping](#word-wrapping)
  - [Padding / wrapping](#padding--wrapping)
  - [Indentation](#indentation)
  - [Char range presets / lookup tables](#char-range-presets--lookup-tables)
  - [Units](#units)
  - [Miscellaneous](#miscellaneous)
- [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
  - [Basic usage examples](#basic-usage-examples)
- [Authors](#authors)
- [License](#license)

## About

Various (~100) string formatting, word wrapping & utility functions, some
higher-order, some memoized.

Partially based on Clojure version of [thi.ng/strf](http://thi.ng/strf).

### General

- `defFormat` / `format`
- `interpolate` / `interpolateKeys`
- `escape` / `unescape`
- `join` / `splice` / `split`
- `repeat`
- `stringify`

### Numeric formatters

- `currency` / `chf` / `eur` / `gpb` / `usd` / `yen`
- `radix`
- `int` / `intLocale`
- `float` / `floatFixedWidth`
- `maybeParseFloat` / `maybeParseInt`
- `percent`
- `uuid`
- `vector`
- `B8` / `B16` / `B32` - fixed size binary formatters
- `U8` / `U16` / `U24` / `U32` / `U64` - fixed size hex formatters
- `Z2` / `Z3` / `Z4` - fixed sized zero padded number formatters

### Casing

- `lower` / `upper` / `capitalize`
- `camel` / `kebab` / `snake` / `upperSnake`

### Slugify

- `slugify` / `slugifyGH`

### ANSI

- `isAnsi` / `isAnsiEnd` / `isAnsiStart`
- `stripAnsi`
- `lengthAnsi`

### Word wrapping

- `wordWrap` / `wordWrapLine` / `wordWrapLines`
- `SPLIT_PLAIN` / `SPLIT_ANSI`

### Padding / wrapping

- `center`
- `padLeft` / `padRight`
- `truncate` / `truncateLeft` / `truncateRight`
- `trim`
- `wrap`

### Indentation

- `spacesToTabs` / `spacesToTabsLine`
- `tabsToSpaces` / `tabsToSpacesLine`

### Char range presets / lookup tables

- `charRange`
- `ALPHA` / `ALPHA_NUM` / `DIGITS` / `LOWER` / `UPPER` / `HEX`
- `BOM` / `ESCAPES` / `ESCAPES_REV`
- `WS` / `PUNCTUATION`

### Units

- `units`
- `bits` / `bytes`
- `grams`
- `meters`
- `seconds`
- `ruler` / `grid`

### Miscellaneous

- `hstr` - [Hollerith strings](https://en.wikipedia.org/wiki/Hollerith_constant)
- `computeCursorPos`

## Status

**STABLE** - used in production

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Bstrings%5D+in%3Atitle)

## Installation

```bash
yarn add @thi.ng/strings
```

ES module import:

```html
<script type="module" src="https://cdn.skypack.dev/@thi.ng/strings"></script>
```

[Skypack documentation](https://docs.skypack.dev/)

For Node.js REPL:

```js
const strings = await import("@thi.ng/strings");
```

Package sizes (brotli'd, pre-treeshake): ESM: 5.44 KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/develop/packages/errors)
- [@thi.ng/hex](https://github.com/thi-ng/umbrella/tree/develop/packages/hex)
- [@thi.ng/memoize](https://github.com/thi-ng/umbrella/tree/develop/packages/memoize)

## Usage examples

Several projects in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory are using this package:

| Screenshot                                                                                                                 | Description                                                                                             | Live demo                                                 | Source                                                                                 |
|:---------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------|:----------------------------------------------------------|:---------------------------------------------------------------------------------------|
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/ascii-raymarch.jpg" width="240"/>      | ASCII art raymarching with thi.ng/shader-ast & thi.ng/text-canvas                                       | [Demo](https://demo.thi.ng/umbrella/ascii-raymarch/)      | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/ascii-raymarch)      |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/big-font.png" width="240"/>            | Large ASCII font text generator using @thi.ng/rdom                                                      | [Demo](https://demo.thi.ng/umbrella/big-font/)            | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/big-font)            |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/crypto-chart.png" width="240"/>        | Basic crypto-currency candle chart with multiple moving averages plots                                  | [Demo](https://demo.thi.ng/umbrella/crypto-chart/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/crypto-chart)        |
|                                                                                                                            | Basic SPA example with atom-based UI router                                                             | [Demo](https://demo.thi.ng/umbrella/login-form/)          | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/login-form)          |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/mastodon-feed.jpg" width="240"/>       | Mastodon API feed reader with support for different media types, fullscreen media modal, HTML rewriting | [Demo](https://demo.thi.ng/umbrella/mastodon-feed/)       | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/mastodon-feed)       |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/procedural-text.jpg" width="240"/>     | Procedural stochastic text generation via custom DSL, parse grammar & AST transformation                | [Demo](https://demo.thi.ng/umbrella/procedural-text/)     | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/procedural-text)     |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/render-audio.png" width="240"/>        | Generative audio synth offline renderer and WAV file export                                             | [Demo](https://demo.thi.ng/umbrella/render-audio/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/render-audio)        |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rstream-spreadsheet.png" width="240"/> | rstream based spreadsheet w/ S-expression formula DSL                                                   | [Demo](https://demo.thi.ng/umbrella/rstream-spreadsheet/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rstream-spreadsheet) |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/xml-converter.png" width="240"/>       | XML/HTML/SVG to hiccup/JS conversion                                                                    | [Demo](https://demo.thi.ng/umbrella/xml-converter/)       | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/xml-converter)       |

## API

[Generated API docs](https://docs.thi.ng/umbrella/strings/)

### Basic usage examples

```ts
// create a custom string formatter
const fmt = defFormat([
    "Price: ",
    { usd: "$", gbp: "£", eur: "€" },
    float(2),
    " (",
    percent(2),
    " off)"
]);

// use format
fmt("usd", 1.2345, 0.5);
// Price: $1.23 (50.00% off)

fmt("eur", 1.2345, 0.25)
// Price: €1.23 (25.00% off)
```

## Authors

- [Karsten Schmidt](https://thi.ng)

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-strings,
  title = "@thi.ng/strings",
  author = "Karsten Schmidt",
  note = "https://thi.ng/strings",
  year = 2015
}
```

## License

&copy; 2015 - 2024 Karsten Schmidt // Apache License 2.0
