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

# ![@thi.ng/fsm](https://media.thi.ng/umbrella/banners-20230807/thing-fsm.svg?44fc664d)

[![npm version](https://img.shields.io/npm/v/@thi.ng/fsm.svg)](https://www.npmjs.com/package/@thi.ng/fsm)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/fsm.svg)
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
- [Related packages](#related-packages)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [API](#api)
  - [Matchers](#matchers)
  - [FSM transducer](#fsm-transducer)
- [Authors](#authors)
- [License](#license)

## About

Composable primitives for building declarative, transducer based Finite-State Machines & matchers for arbitrary data streams.

See the [hiccup-markdown
parser](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-markdown/src/parser.ts)
& [example](https://demo.thi.ng/umbrella/markdown/) for a concrete use
case.

## Status

**DEPRECATED** - superseded by other package(s)

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Bfsm%5D+in%3Atitle)

This package will be merged with and update the existing
[@thi.ng/transducers-fsm](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers-fsm)
package.

## Related packages

- [@thi.ng/parse](https://github.com/thi-ng/umbrella/tree/develop/packages/parse) - Purely functional parser combinators & AST generation for generic inputs
- [@thi.ng/transducers-fsm](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers-fsm) - Transducer-based Finite State Machine transformer

## Installation

```bash
yarn add @thi.ng/fsm
```

ES module import:

```html
<script type="module" src="https://cdn.skypack.dev/@thi.ng/fsm"></script>
```

[Skypack documentation](https://docs.skypack.dev/)

For Node.js REPL:

```js
const fsm = await import("@thi.ng/fsm");
```

Package sizes (brotli'd, pre-treeshake): ESM: 1.31 KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/arrays](https://github.com/thi-ng/umbrella/tree/develop/packages/arrays)
- [@thi.ng/equiv](https://github.com/thi-ng/umbrella/tree/develop/packages/equiv)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/develop/packages/errors)
- [@thi.ng/strings](https://github.com/thi-ng/umbrella/tree/develop/packages/strings)
- [@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers)

## API

[Generated API docs](https://docs.thi.ng/umbrella/fsm/)

There're two key concepts provided by this package:

### Matchers

Matchers are composable functions which receive a single input value and
attempt to match it to their configured criteria / patterns. Matchers
also support optional user callbacks, which are executed when a match
was made and are responsible for state transitions, state update and
production of any result values.

- [`alts()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/alts.ts)
- [`altsLit()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/alts-lit.ts)
- [`always()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/always.ts)
- [`lit()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/lit.ts)
- [`never()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/never.ts)
- [`not()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/not.ts)
- [`range()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/range.ts) (plus multiple presets)
- [`repeat()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/repeat.ts)
- [`seq()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/seq.ts)
- [`str()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/str.ts)
- [`until()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/until.ts)

See docs strings in `/src` folder for now.

### FSM transducer

The
[`fsm()`](https://github.com/thi-ng/umbrella/tree/develop/packages/fsm/src/fsm.ts)
function is a Finite-state machine transducer / iterator with support
for single lookahead values. Takes an object of `states` and their
matchers, an arbitrary context object and an `initial` state ID.

The returned transducer consumes inputs of type `T` and produces results
of type `R`. The results are produced by callbacks of the given state
matchers. Each can produce any number of values. If a callback returns a
result wrapped w/ `reduced()`, the FSM causes early termination of the
overall transducer pipeline. Failed state callbacks too can produce
outputs, but will afterwards terminate the FSM.

An `IllegalStateError` will be thrown if a transition to an undefined
state ID occurs.

The optional `update` function will be invoked for each input prior to
executing the currently active state matcher. It is intended to update
the context object (e.g. to update input location info for generating
error messages).

If the optional `src` iterable is given, the function returns a
transforming iterator of the FSM results.

## Authors

- [Karsten Schmidt](https://thi.ng)

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-fsm,
  title = "@thi.ng/fsm",
  author = "Karsten Schmidt",
  note = "https://thi.ng/fsm",
  year = 2018
}
```

## License

&copy; 2018 - 2024 Karsten Schmidt // Apache License 2.0
