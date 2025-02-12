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

# ![@thi.ng/meta-css](https://media.thi.ng/umbrella/banners-20230807/thing-meta-css.svg?36f6c755)

[![npm version](https://img.shields.io/npm/v/@thi.ng/meta-css.svg)](https://www.npmjs.com/package/@thi.ng/meta-css)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/meta-css.svg)
[![Mastodon Follow](https://img.shields.io/mastodon/follow/109331703950160316?domain=https%3A%2F%2Fmastodon.thi.ng&style=social)](https://mastodon.thi.ng/@toxi)

> [!NOTE]
> This is one of 189 standalone projects, maintained as part
> of the [@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo
> and anti-framework.
>
> 🚀 Help me to work full-time on these projects by [sponsoring me on
> GitHub](https://github.com/sponsors/postspectacular). Thank you! ❤️

- [About](#about)
- [Generating CSS frameworks](#generating-css-frameworks)
  - [Framework generation specs & syntax](#framework-generation-specs--syntax)
  - [Example generation spec](#example-generation-spec)
  - [Spec structure](#spec-structure)
    - [Variations](#variations)
    - [Parametric IDs](#parametric-ids)
    - [Values](#values)
    - [Properties](#properties)
    - [Key value generation](#key-value-generation)
  - [Media query definitions](#media-query-definitions)
  - [Custom declarations](#custom-declarations)
- [Converting meta stylesheets to CSS](#converting-meta-stylesheets-to-css)
  - [Meta-stylesheets syntax](#meta-stylesheets-syntax)
    - [Class identifiers & media query prefixes](#class-identifiers--media-query-prefixes)
    - [Media query prefixes](#media-query-prefixes)
  - [Including custom CSS files](#including-custom-css-files)
  - [Force inclusion of unreferenced classes](#force-inclusion-of-unreferenced-classes)
- [Exporting a generated framework as CSS](#exporting-a-generated-framework-as-css)
  - [Media query variations](#media-query-variations)
- [Bundled CSS base framework](#bundled-css-base-framework)
  - [Classes by category](#classes-by-category)
  - [Media queries](#media-queries)
- [Status](#status)
- [Related packages](#related-packages)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [Authors](#authors)
- [License](#license)

## About

Data-driven CSS framework codegen, transpiler & bundler.

This toolkit (started as experiment in 2016) and the overall design approach and
workflows proposed by it are heavily building atop the concept of _CSS utility
classes_ (as known from [Tachyons](https://tachyons.io/),
[Turret](https://turretcss.com/) or the newer
[Tailwind](https://tailwindcss.com/) projects). How and where those CSS classes
are defined and later applied is however a major defining point of difference to
these other existing approaches and will be explained in this document. To
remove the need for any complex & bloated CSS-related dependencies (parsers
etc.) and to simplify building secondary tooling (e.g. part of this readme is an
[auto-generated report of the included base framework
specs](#bundled-css-base-framework)), we're using JSON — rather than CSS — as
data format to: 1) express the _generative_ rules to define all the CSS classes,
declarations, media query criteria which are forming a framework and
2) as intermediate data format for a generated CSS framework itself. **The
entire toolkit (incl. all bundled dependencies) is currently only 32KB!**

This readme aims to provide a thorough overview of this toolchain and some
concrete usage examples...

Note: In all cases, final CSS generation itself is handled by
[thi.ng/hiccup-css](https://github.com/thi-ng/umbrella/blob/develop/packages/hiccup-css/).
Please see its readme for further useful information.

**👷🏻 This is all WIP!** See included & [linked examples](#usage-examples) for
concrete usage...

## Generating CSS frameworks

The `generate` command is used to generate custom CSS frameworks with (likely)
hundreds of utility classes, all derived from a number of extremely compact,
parametric JSON rule specs. This process generates all desired, combinatorial
versions of various rules/declarations and exports them to a framework JSON file
used as intermediary stage for the other commands provided by this toolchain.
The [syntax/format of the generator rules](#framework-generation-specs--syntax)
is explained further on. These framework specs can be split up into multiple
files for better handling and organization, can define [CSS base
declarations](#custom-declarations) (e.g. for normalization purposes),
[arbitrary media query criteria](#media-query-definitions) (all later
combinable), shared lookup tables for colors, margins, sizes, timings etc.

The package includes dozens of generator specs for a basic, fully customizable,
Tachyons-derived [CSS framework](#bundled-css-base-framework). These specs and
resulting framework are still being worked on and are used for some example
projects in this repo, but are mostly intended as basic starting points for
creating other custom frameworks (_in the hope some useful specs will be shared back
similarly_)...

```text
metacss generate --help

Usage: metacss generate [opts] inputs...

Flags:

-p, --pretty            Pretty print output
-v, --verbose           Display extra process information

Main:

-o STR, --out STR       Output file (or stdout)
--prec INT              Number of fractional digits (default: 3)
```

### Framework generation specs & syntax

This section gives an overview of the JSON format used to generate CSS
frameworks of dozens (usually hundreds or thousands) of utility classes,
including many possible variations (per spec).

Generation specs use a simple JSON structure as shown below. The specs can be
split over multiple files and will all be merged by the `generate` command of
the toolchain.

```json5
{
    // optional meta data (later used for comment injection in generated CSS)
    "info": {
        "name": "Framework name",
        "version": "0.0.0",
    },
    // optional media queries and their criteria, will be merged from multiple spec files
    "media": {
        "large": { "min-width": "60rem" },
        "dark": { "prefers-color-scheme": "dark" },
        "anim": { "prefers-reduced-motion": false }
    },
    // optional shared values/LUTs (arrays or objects)
    // (local to the current file only)
    "tables": {
        "margins": [0, 0.25, 0.5, 1, 2, 4]
    },
    // optional shared variations (local to current file only)
    "vars": {
        "size": ["width", "height"]
    },
    // optional thi.ng/hiccup-css declarations which will be part of the framework
    // (e.g. for CSS reset purposes), will be merged from multiple spec files
    "decls": [
        ["html", { "box-sizing": "border-box" }]
    ],
    // array of actual generation specs
    "specs": [
        //...
    ]
}
```

### Example generation spec

The following generator document uses a single small generative rule spec to
create altogether 21 utility classes for various possible margins (where 21 = 3
margin sizes provided × 7 variations).

For each additional value added to the `margins` table, 7 more CSS classes will be
generated. The `name` (class) and `props` (CSS property name) are parametric and
will be explained in more detail further below.

```json tangle:export/readme-margins.mcss.json
{
    "tables": {
        "margins": [0, 0.5, 1]
    },
    "specs": [
        {
            "name": "m<vid><k>",
            "props": "margin<var>",
            "values": "margins",
            "unit": "rem",
            "vars": ["a", "t", "r", "b", "l", "h", "v"]
        }
    ]
}
```

Assuming the above spec has been saved to file `margins.mcss.json`...

```bash
# the generate cmd can merge specs from multiple input files
# if no `--out` file is given, the result will go to stdout
metacss generate --pretty margins.mcss.json
```

...this command (with the above spec) will generate the following output (here
we're only interested in the entries under `classes`):

```json
{
    "info": {
        "name": "TODO",
        "version": "0.0.0"
    },
    "media": {},
    "classes": {
        "ma0": { "margin": "0rem" },
        "ma1": { "margin": ".5rem" },
        "ma2": { "margin": "1rem" },
        "mh0": { "margin-left": "0rem", "margin-right": "0rem" },
        "mh1": { "margin-left": ".5rem", "margin-right": ".5rem" },
        "mh2": { "margin-left": "1rem", "margin-right": "1rem" },
        "mv0": { "margin-top": "0rem", "margin-bottom": "0rem" },
        "mv1": { "margin-top": ".5rem", "margin-bottom": ".5rem" },
        "mv2": { "margin-top": "1rem", "margin-bottom": "1rem" },
        "mt0": { "margin-top": "0rem" },
        "mt1": { "margin-top": ".5rem" },
        "mt2": { "margin-top": "1rem" },
        "mr0": { "margin-right": "0rem" },
        "mr1": { "margin-right": ".5rem" },
        "mr2": { "margin-right": "1rem" },
        "mb0": { "margin-bottom": "0rem" },
        "mb1": { "margin-bottom": ".5rem" },
        "mb2": { "margin-bottom": "1rem" },
        "ml0": { "margin-left": "0rem" },
        "ml1": { "margin-left": ".5rem" },
        "ml2": { "margin-left": "1rem" }
    }
}
```

When later used in stylesheets, we can then refer to each of these classes by
their generated names, e.g. `ma0` to disable all margins or `mh2` to set both
left & right margins to `1rem` (in this case)...

### Spec structure

An individual generator spec JSON object can contain the following keys:

| **ID**   | **Type**                | **Description**                                              |
|----------|-------------------------|--------------------------------------------------------------|
| `key`    | string, optional        | Method for deriving keys from current value                  |
| `name`   | string                  | Parametric name for the generated CSS class(es)              |
| `props`  | string or object        | CSS property name(s), possibly parametric                    |
| `unit`   | string, optional        | CSS unit to use for values                                   |
| `user`   | any, optional           | Custom, arbitrary user data, comments, metadata etc.         |
| `values` | string, array or object | Values to be assigned to CSS properties, possibly parametric |
| `vars`   | string[], optional      | Array of variation IDs (see section below)                   |

The number of generated CSS classes per spec is the number of items in `values`
multiplied by the number of variations in `var` (if any).

Any `user` data will be stored (as is) with each generated CSS class, but
currently has no direct use in the toolchain and is purely intended for
additional user-defined custom tooling.

#### Variations

Variations can be requested by providing an array of valid variation IDs. If
used, `<vid>` or `<var>` parameters **must** be used in the `name` or else
naming conflicts will occur.

The following variation presets are available:

| **ID**     | **Expanded values**   |
|------------|-----------------------|
| `""`       | `[""]`                |
| `"a"`      | `[""]`                |
| `"b"`      | `["-bottom"]`         |
| `"bottom"` | `["bottom"]`          |
| `"h"`      | `["-left", "-right"]` |
| `"l"`      | `["-left"]`           |
| `"left"`   | `["left"]`            |
| `"r"`      | `["-right"]`          |
| `"right"`  | `["right"]`           |
| `"t"`      | `["-top"]`            |
| `"top"`    | `["top"]`             |
| `"v"`      | `["-top", "-bottom"]` |
| `"x"`      | `["-x"]`              |
| `"y"`      | `["-y"]`              |

Custom, file-local variations can also be used (parameters in `name` and `props`
will be explained next), e.g.:

```json tangle:export/readme-custom-vars.mcss.json
{
    "vars": {
        "svg": ["fill", "stroke"]
    },
    "specs": [
        {
            "name": "<var>-<k>",
            "props": { "<var>": "<v>" },
            "values": { "black": "#000", "white": "#fff", "current": "currentColor" },
            "vars": ["svg"]
        }
    ]
}
```

This spec will generate the following classes:

```json
{
    "fill-black": { "fill": "#000" },
    "fill-white": { "fill": "#fff" },
    "fill-current": { "fill": "currentColor" },
    "stroke-black": { "stroke": "#000" },
    "stroke-white": { "stroke": "#fff" },
    "stroke-current": { "stroke": "currentColor" }
}
```

#### Parametric IDs

The following parameters can (and should) be used in a spec's `name` and `props`
to generate multiple pattern-based values (more examples below).

- `<vid>` is the ID of the currently processed variation (e.g. a value from the
  ID column in the above table). If no variations are requested, this value will
  be an empty string.
- `<var>` is one of the expanded values for the current variation (e.g. 2nd
  column of variations table). If no variations are defined, this too will be an
  empty string.
- `<v>` is the currently processed value of a spec's `values`.
- `<k>` is the (possibly derived) key for the currently processed value of a
  spec's `values` collection and will depend on the type of `values` (see [key
  value generation](#key-value-generation))

#### Values

The `values` are used to populate the `props` (CSS properties). If `values` is a
string it will be used as table-name to look up in the current spec file's
`tables`, an object storing value collections which should be shared among specs
(only in the same file).

Other allowed types of `values`: string array, numeric array or object of
key-value pairs (where values are strings or numbers too). The following
examples will all produce the same outcome:

Using a named `tables` entry:

```json
{
    "tables": {
        "test": ["red", "green", "blue"]
    },
    "specs": [
        {
            "name": "test-<v>",
            "props": "color",
            "values": "test"
        }
    ]
}
```

Using an array directly (here only showing the spec itself for brevity):

```json
{
    "name": "test-<v>",
    "props": "color",
    "values": ["red", "green", "blue"]
}
```

Using an object (ignoring the keys, only using the values here):

```json
{
    "name": "test-<v>",
    "props": "color",
    "values": { "r": "red", "g": "green", "b": "blue"}
}
```

All 3 versions will result in these utility classes:

```json
{
    "test-red": { "color": "red" },
    "test-green": { "color": "green" },
    "test-blue": { "color": "blue" }
}
```

#### Properties

The `props` field is used to define one or more CSS property names and
optionally their intended values (both can be parametric). If `props` is a
string, the values assigned to the property will be those given in `values`
(optionally with assigned `unit`, if provided)

```json
{
    "name": "bg<k>",
    "props": {
        "background-image": "url(<v>)",
        "background-size": "cover",
    },
    "values": ["abc.jpg", "def.jpg", "xyz.jpg"]
}
```

Will result in these definitions:

```json
{
    "bg0": { "background-image": "url(abc.jpg)", "background-size": "cover" },
    "bg1": { "background-image": "url(def.jpg)", "background-size": "cover" },
    "bg2": { "background-image": "url(xyz.jpg)", "background-size": "cover" }
}
```

#### Key value generation

The `key` field is only used when `values` is resolving to an array. In this
case this field determines how a "key" value (aka the `<k>` param for string
interpolation) will be derived for each value in `values`:

| **`key`** | **`values`**    | **Description**         | **Examples** |
|-----------|-----------------|-------------------------|--------------|
| `v`       | `[10, 20, ...]` | Actual array item value | 10, 20, ...  |
| `i`       | `[10, 20, ...]` | Array item index        | 0, 1,...     |
| `i+1`     | `[10, 20, ...]` | Array item index + 1    | 1, 2,...     |

If `values` resolves to an object, the `<k>` param will always be the key of the
currently processed value.

```json
{
    "name": "test-<k>",
    "props": "test-prop",
    "values": { "abc": 23, "xyz": 42 }
}
```

The above spec will generate the following (some parts omitted):

```json
{
    "test-abc": { "test-prop": 23 },
    "test-xyz": { "test-prop": 42 },
}
```

### Media query definitions

Media queries can be defined via the top-level `media` object in a spec file.
Each query has an ID and an object of one or more query criteria.

The key-value pairs of the conditional object are interpreted as follows and
ALWAYS combined using `and`:

| Key/Value pair                   | Result                         |
|----------------------------------|--------------------------------|
| `"min-width": "10rem"`           | `(min-width: 10rem)`           |
| `"prefers-color-scheme": "dark"` | `(prefers-color-scheme: dark)` |
| `print: true`                    | `print`                        |
| `print: false`                   | `not print`                    |
| `print: "only"`                  | `only print`                   |

See [media queries in the bundled base
specs](https://github.com/thi-ng/umbrella/blob/982fff7bfcc48f108b6ad88f854ef00be4078510/packages/meta-css/specs/_info.json#L6-L24)

### Custom declarations

Each of the JSON spec files can provide fixed CSS declarations via the `decls`
key. These declarations are to be given in
[thi.ng/hiccup-css](https://github.com/thi-ng/umbrella/blob/develop/packages/hiccup-css/)
format and are passed as is to the CSS serializer used by the `convert` and
`export` commands. Please see
[`/specs/normalize.mcss.json`](https://github.com/thi-ng/umbrella/blob/develop/packages/meta-css/specs/normalize.mcss.json)
for examples and the [thi.ng/hiccup-css
readme](https://github.com/thi-ng/umbrella/blob/develop/packages/hiccup-css/README.md)
for detailed reference.

```json
{
    "decls": [
        [":root", { "font-size": "16px" }],
        ["*", { "margin": 0 }]
    ]
}
```

## Converting meta stylesheets to CSS

The `convert` command is used to compile & bundle actual CSS from user-provided
MetaCSS stylesheets (`.mcss` files) and the JSON framework specs created by the
`generate` command. The meta-stylesheets support any CSS selectors, are nestable
and compose full CSS declarations from lists of the utility classes in the
generated framework.

Each item (aka utility class name) can be prefixed with an arbitrary number of
media query IDs (also custom defined in the framework): e.g. `dark:bg-color-black`
might refer to a CSS class to set a black ground, with the `dark:` prefix
referring to a defined media query which only applies this class when dark mode
is enabled...

Selectors, declarations and media query criteria will be deduplicated and merged
from multiple input files. **The resulting CSS will only contain referenced
rules** and can be generated in minified or pretty printed formats (it's also
possible to [force include CSS classes which are otherwise
unreferenced](#force-inclusion-of-unreferenced-classes)). Additionally, multiple
`.mcss` stylesheets can be watched for changes (their definitions getting
merged), and existing CSS files can be included (prepended) in the output(s) too.

```text
metacss convert --help

Usage: metacss convert [opts] input [...]

Flags:

-b, --bundle            Bundle inputs (see `out` option)
-d, --no-decls          Don't emit framework decls
--no-header             Don't emit generated header comment
--no-write              Don't write files, use stdout only
-p, --pretty            Pretty print output
-v, --verbose           Display extra process information
-w, --watch             Watch input files for changes

Main:

-e STR, --eval STR      eval meta stylesheet in given string (ignores other
                        inputs & includes)
-f STR, --force STR     [multiple] CSS classes to force include (wildcards are
                        supported, @-prefix will read from file)
-I STR, --include STR   [multiple] Include CSS files (prepend)
-o STR, --out STR       Output file (or stdout)
-s STR, --specs STR     [required] Path to generated JSON defs
```

Notes:

- The `--no-write` flag is only used if `--bundle` is **disabled**
- The `--out` file arg is only used if `--bundle` is **enabled**

If bundling is disabled (default), each input `.mcss` file is converted
individually and results are written to the same directory, but using `.css` as
file extension (and unless `--no-write` is enabled). This behavior is intended
for local style definitions of web components.

### Meta-stylesheets syntax

As mentioned earlier, the `convert` command transpiles meta-stylesheets into
actual CSS. These stylesheets support any CSS selector, support selector
nesting and have the following basic syntax:

```text
// line comment
selector {
  class-id1 class-id2 ...
  {
    nested-selector {
      class-id3 ...
      {
        ...
      }
    }
  }
}
```

#### Class identifiers & media query prefixes

As indicated by the above file structure, `.mcss` stylesheets purely consist of
CSS selectors and the names of the utility classes defined in a generated framework.
For example, using the [bundled framework specs](#bundled-css-base-framework),
this simple meta-stylesheet `body { ma0 monospace blue }` creates a CSS rule for
`body` with the definitions of the generated `ma0`, `monospace` and `blue`
classes inline-expanded:

```css
body {
    margin: 0rem;
    font-family: Monaco, Menlo, Consolas, 'Courier New', monospace;
    color: #357edd;
}
```

#### Media query prefixes

This toolchain doesn't pre-generate media-query-specific versions of any CSS
class, and any utility class ID/token can be prefixed with any number of media
query IDs (separated by `:`). These [media queries are defined as part of the
framework generation specs](#media-query-definitions) and when used as a prefix,
multiple query IDs can be combined freely. For example, the meta-stylesheet
`a:hover { dark:bg-color-blue dark:anim:bg-anim2 }` will auto-create two separate CSS
`@media`-query blocks for the query IDs `dark` and `(dark AND anim)`:

```css
@media (prefers-color-scheme: dark) {
    a:hover {
        background-color: #357edd;
    }
}

@media (prefers-color-scheme: dark) and (not (prefers-reduced-motion)) {
    a:hover {
        transition: 0.25s background-color ease-in-out;
    }
}
```

A more detailed example, split over two files (for merging & bundling):

readme.mcss:

```text tangle:export/readme.mcss
body {
    // no margins
    ma0
    // default colors
    bg-color-white color-black
    // colors for dark mode
    dark:bg-color-black dark:color-white
}

#app { ma3 }

.bt-group-v > a {
    db w-100 l:w-50 ph3 pv2 bwb1
    dark:bg-color-purple dark:color-white dark:b--color-black
    light:bg-color-light-blue light:color-black light:b--color-white

    // nested selectors
    {
        :hover { bg-color-gold color-black anim:bg-anim2 }
        :first-child { brt3 }
        :last-child { brb3 bwb0 }
    }
}
```

readme2.mcss:

We will merge the definitions in this file with the ones above (i.e. adding &
overriding some of the declarations, here: a larger border radius):

```text tangle:export/readme2.mcss
#app { pa2 }

.bt-group-v > a {
    {
        // override border radii
        :first-child { brt4 }
        :last-child { brb4 }
    }
}
```

```bash
# if no --out dir is specified, writes result to stdout...
# use previously generated framework for resolving all identifiers & media queries
metacss convert --pretty --specs framework.json readme.mcss readme2.mcss
```

Resulting merged CSS bundle output:

```css
/*! MetaCSS base v0.0.1 - generated by thi.ng/meta-css @ 2023-12-18T12:22:36.548Z */
body {
    margin: 0rem;
    background-color: #fff;
    color: #000;
}

#app {
    margin: 1rem;
    padding: .5rem;
}

.bt-group-v > a {
    display: block;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    border-bottom-style: solid;
    border-bottom-width: .125rem;
}

.bt-group-v > a:hover {
    background-color: #ffb700;
    color: #000;
}

.bt-group-v > a:first-child {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

.bt-group-v > a:last-child {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border-bottom-style: solid;
    border-bottom-width: 0rem;
}

@media (prefers-color-scheme:dark) {

    body {
        background-color: #000;
        color: #fff;
    }

    .bt-group-v > a {
        background-color: #5e2ca5;
        color: #fff;
        border-color: #000;
    }

}

@media (min-width:60rem) {

    .bt-group-v > a {
        width: 50%;
    }

}

@media (prefers-color-scheme:light) {

    .bt-group-v > a {
        background-color: #96ccff;
        color: #000;
        border-color: #fff;
    }

}

@media not (prefers-reduced-motion) {

    .bt-group-v > a:hover {
        transition: 0.2s background-color ease-in-out;
    }

}
```

### Including custom CSS files

One or more existing CSS files can be included & prepended to the output via the
`--include`/`-I` arg (which can be given multiple times). These files are used
verbatim and will **not** be transformed or reformatted in any way.

### Force inclusion of unreferenced classes

Only the CSS classes (and their optionally associated media queries) referenced
in a `.mcss` stylesheet will appear in the export CSS bundle. This ensures that
the resulting CSS will only contain what's actually used (same effect as
tree-shaking, only vastly more efficient). However, this also means any CSS
classes (and optionally, their media query qualifiers) which are otherwise
referenced (e.g. from JS/TS source code or HTML docs) **will not** be included
by default and they will need to be listed manually for forced inclusion.

This can be achieved via the `--force`/`-f` arg (also can be given multiple
times). This option also supports basic `*`-wildcard patterns, e.g. `bg-*` to
include all classes with prefix `bg-`. Furthermore, for larger projects it's
useful to store these names/patterns in a separate file. For that purpose, use
the `@` prefix (e.g. `-f @includes.txt`) to indicate reading from file (only
reading from a single file is supported at current)... See the [meta-css-basics
example
project](https://github.com/thi-ng/umbrella/blob/develop/examples/meta-css-basics)
for concrete usage...

## Exporting a generated framework as CSS

The `export` command is intended for those who're mainly interested in the CSS
framework generation aspects of this toolchain. This command merely takes an
existing generated framework JSON file and serializes it to a single CSS file,
e.g. to be then used with other CSS tooling (e.g. `postcss`).

As with the `convert` command, additional CSS files can also be included
(prepended) in the output file.

If the `--only-decls` option is used, **only** the [framework
declarations](#custom-declarations) but none of the generated utility classes
will be exported.

```text
metacss export --help

Usage: metacss export [opts] input

Flags:

-d, --no-decls          Don't emit framework decls
--no-header             Don't emit generated header comment
--only-decls            Only emit framework decls
-p, --pretty            Pretty print output
-v, --verbose           Display extra process information

Main:

-I STR, --include STR   [multiple] Include CSS files (prepend)
-m ID, --media ID       [multiple] Media query IDs (use 'ALL' for all)
-o STR, --out STR       Output file (or stdout)
```

### Media query variations

Users can choose to generate variations of all defined utility classes for any
of the framework-defined media query IDs. This will create additional suffixed
versions of all classes (with their appropriate media query wrappers) and cause
a potentially massive output (depending on the overall number/complexity of the
generated classes). Again, the idea is that the resulting CSS file will be
post-processed with 3rd party CSS tooling...

For example, if the framework contains a CSS class `w-50` (e.g. to set the width
to 50%) and media queries for different screen sizes (e.g. named `ns`, `l`),
then the export with said media queries will also generate classes `w-50-ns`
and `w-50-l` (incl. their corresponding `@media` wrappers).

## Bundled CSS base framework

The package includes a large number of useful specs in [/specs](https://github.com/thi-ng/umbrella/blob/develop/packages/meta-css/specs/). These are readily usable, but also are provided as starting point to define your own custom framework(s)...

Currently, there are 940 CSS utility classes defined in MetaCSS base v0.7.0:

### Classes by category

#### Accessibility <!-- notoc -->

`screen-reader` / `screen-reader-focus`

#### Animations / transitions <!-- notoc -->

`anim-alternate` / `anim-alternate-reverse` / `anim-normal` / `anim-reverse` / `bg-anim1` / `bg-anim2` / `bg-anim3` / `fadein1` / `fadein2` / `fadein3` / `fadeout1` / `fadeout2` / `fadeout3` / `spin1` / `spin2` / `spin3`

#### Aspect ratios <!-- notoc -->

`aspect-ratio-1x1` / `aspect-ratio-1x2` / `aspect-ratio-2x1` / `aspect-ratio-2x3` / `aspect-ratio-3x2` / `aspect-ratio-3x4` / `aspect-ratio-4x3` / `aspect-ratio-5x7` / `aspect-ratio-7x5` / `aspect-ratio-9x16` / `aspect-ratio-16x9` / `bg-aspect-ratio-1x1` / `bg-aspect-ratio-1x2` / `bg-aspect-ratio-2x1` / `bg-aspect-ratio-2x3` / `bg-aspect-ratio-3x2` / `bg-aspect-ratio-3x4` / `bg-aspect-ratio-4x3` / `bg-aspect-ratio-5x7` / `bg-aspect-ratio-7x5` / `bg-aspect-ratio-9x16` / `bg-aspect-ratio-16x9` / `bg-aspect-ratio-object`

#### Background <!-- notoc -->

`bg-contain` / `bg-cover` / `bg-pos-center` / `bg-pos-e` / `bg-pos-n` / `bg-pos-ne` / `bg-pos-nw` / `bg-pos-s` / `bg-pos-se` / `bg-pos-sw` / `bg-pos-w`

#### Border radius <!-- notoc -->

`br0` / `br1` / `br2` / `br3` / `br4` / `br-100` / `br-pill` / `brb0` / `brb1` / `brb2` / `brb3` / `brb4` / `brl0` / `brl1` / `brl2` / `brl3` / `brl4` / `brr0` / `brr1` / `brr2` / `brr3` / `brr4` / `brt0` / `brt1` / `brt2` / `brt3` / `brt4`

#### Border width <!-- notoc -->

`bw0` / `bw1` / `bw2` / `bw3` / `bw4` / `bw5` / `bw-1px` / `bwb0` / `bwb1` / `bwb2` / `bwb3` / `bwb4` / `bwb5` / `bwb-1px` / `bwl0` / `bwl1` / `bwl2` / `bwl3` / `bwl4` / `bwl5` / `bwl-1px` / `bwr0` / `bwr1` / `bwr2` / `bwr3` / `bwr4` / `bwr5` / `bwr-1px` / `bwt0` / `bwt1` / `bwt2` / `bwt3` / `bwt4` / `bwt5` / `bwt-1px`

#### Colors <!-- notoc -->

`b--color-black` / `b--color-blue` / `b--color-current` / `b--color-dark-blue` / `b--color-dark-gray` / `b--color-dark-green` / `b--color-dark-pink` / `b--color-dark-red` / `b--color-gold` / `b--color-gray` / `b--color-green` / `b--color-hot-pink` / `b--color-light-blue` / `b--color-light-gray` / `b--color-light-green` / `b--color-light-pink` / `b--color-light-purple` / `b--color-light-red` / `b--color-light-silver` / `b--color-light-yellow` / `b--color-lightest-blue` / `b--color-mid-gray` / `b--color-moon-gray` / `b--color-navy` / `b--color-near-black` / `b--color-near-white` / `b--color-orange` / `b--color-pink` / `b--color-purple` / `b--color-red` / `b--color-silver` / `b--color-transparent` / `b--color-washed-blue` / `b--color-washed-green` / `b--color-washed-red` / `b--color-washed-yellow` / `b--color-white` / `b--color-yellow` / `b--color1` / `b--color2` / `b--color3` / `b--color4` / `b--color5` / `b--color6` / `b--color7` / `b--color8` / `b--color9` / `b--color10` / `b--color11` / `b--color12` / `b--color13` / `b--color14` / `b--color15` / `b--color16` / `bg-color-black` / `bg-color-blue` / `bg-color-current` / `bg-color-dark-blue` / `bg-color-dark-gray` / `bg-color-dark-green` / `bg-color-dark-pink` / `bg-color-dark-red` / `bg-color-gold` / `bg-color-gray` / `bg-color-green` / `bg-color-hot-pink` / `bg-color-light-blue` / `bg-color-light-gray` / `bg-color-light-green` / `bg-color-light-pink` / `bg-color-light-purple` / `bg-color-light-red` / `bg-color-light-silver` / `bg-color-light-yellow` / `bg-color-lightest-blue` / `bg-color-mid-gray` / `bg-color-moon-gray` / `bg-color-navy` / `bg-color-near-black` / `bg-color-near-white` / `bg-color-orange` / `bg-color-pink` / `bg-color-purple` / `bg-color-red` / `bg-color-silver` / `bg-color-transparent` / `bg-color-washed-blue` / `bg-color-washed-green` / `bg-color-washed-red` / `bg-color-washed-yellow` / `bg-color-white` / `bg-color-yellow` / `bg-color1` / `bg-color2` / `bg-color3` / `bg-color4` / `bg-color5` / `bg-color6` / `bg-color7` / `bg-color8` / `bg-color9` / `bg-color10` / `bg-color11` / `bg-color12` / `bg-color13` / `bg-color14` / `bg-color15` / `bg-color16` / `color-black` / `color-blue` / `color-current` / `color-dark-blue` / `color-dark-gray` / `color-dark-green` / `color-dark-pink` / `color-dark-red` / `color-gold` / `color-gray` / `color-green` / `color-hot-pink` / `color-light-blue` / `color-light-gray` / `color-light-green` / `color-light-pink` / `color-light-purple` / `color-light-red` / `color-light-silver` / `color-light-yellow` / `color-lightest-blue` / `color-mid-gray` / `color-moon-gray` / `color-navy` / `color-near-black` / `color-near-white` / `color-orange` / `color-pink` / `color-purple` / `color-red` / `color-silver` / `color-transparent` / `color-washed-blue` / `color-washed-green` / `color-washed-red` / `color-washed-yellow` / `color-white` / `color-yellow` / `color1` / `color2` / `color3` / `color4` / `color5` / `color6` / `color7` / `color8` / `color9` / `color10` / `color11` / `color12` / `color13` / `color14` / `color15` / `color16` / `fill-color-black` / `fill-color-blue` / `fill-color-current` / `fill-color-dark-blue` / `fill-color-dark-gray` / `fill-color-dark-green` / `fill-color-dark-pink` / `fill-color-dark-red` / `fill-color-gold` / `fill-color-gray` / `fill-color-green` / `fill-color-hot-pink` / `fill-color-light-blue` / `fill-color-light-gray` / `fill-color-light-green` / `fill-color-light-pink` / `fill-color-light-purple` / `fill-color-light-red` / `fill-color-light-silver` / `fill-color-light-yellow` / `fill-color-lightest-blue` / `fill-color-mid-gray` / `fill-color-moon-gray` / `fill-color-navy` / `fill-color-near-black` / `fill-color-near-white` / `fill-color-orange` / `fill-color-pink` / `fill-color-purple` / `fill-color-red` / `fill-color-silver` / `fill-color-transparent` / `fill-color-washed-blue` / `fill-color-washed-green` / `fill-color-washed-red` / `fill-color-washed-yellow` / `fill-color-white` / `fill-color-yellow` / `fill-color1` / `fill-color2` / `fill-color3` / `fill-color4` / `fill-color5` / `fill-color6` / `fill-color7` / `fill-color8` / `fill-color9` / `fill-color10` / `fill-color11` / `fill-color12` / `fill-color13` / `fill-color14` / `fill-color15` / `fill-color16` / `o-0` / `o-10` / `o-20` / `o-30` / `o-40` / `o-50` / `o-60` / `o-70` / `o-80` / `o-90` / `o-100` / `stroke-color-black` / `stroke-color-blue` / `stroke-color-current` / `stroke-color-dark-blue` / `stroke-color-dark-gray` / `stroke-color-dark-green` / `stroke-color-dark-pink` / `stroke-color-dark-red` / `stroke-color-gold` / `stroke-color-gray` / `stroke-color-green` / `stroke-color-hot-pink` / `stroke-color-light-blue` / `stroke-color-light-gray` / `stroke-color-light-green` / `stroke-color-light-pink` / `stroke-color-light-purple` / `stroke-color-light-red` / `stroke-color-light-silver` / `stroke-color-light-yellow` / `stroke-color-lightest-blue` / `stroke-color-mid-gray` / `stroke-color-moon-gray` / `stroke-color-navy` / `stroke-color-near-black` / `stroke-color-near-white` / `stroke-color-orange` / `stroke-color-pink` / `stroke-color-purple` / `stroke-color-red` / `stroke-color-silver` / `stroke-color-transparent` / `stroke-color-washed-blue` / `stroke-color-washed-green` / `stroke-color-washed-red` / `stroke-color-washed-yellow` / `stroke-color-white` / `stroke-color-yellow` / `stroke-color1` / `stroke-color2` / `stroke-color3` / `stroke-color4` / `stroke-color5` / `stroke-color6` / `stroke-color7` / `stroke-color8` / `stroke-color9` / `stroke-color10` / `stroke-color11` / `stroke-color12` / `stroke-color13` / `stroke-color14` / `stroke-color15` / `stroke-color16`

#### Content <!-- notoc -->

`content-data-lang` / `content-href` / `content-id` / `content-name` / `content-slot` / `content-title`

#### Cursors <!-- notoc -->

`cursor-alias` / `cursor-auto` / `cursor-cell` / `cursor-col` / `cursor-context` / `cursor-copy` / `cursor-cross` / `cursor-default` / `cursor-e` / `cursor-ew` / `cursor-forbidden` / `cursor-grab` / `cursor-grabbing` / `cursor-help` / `cursor-in` / `cursor-move` / `cursor-n` / `cursor-ne` / `cursor-news` / `cursor-no-drop` / `cursor-none` / `cursor-ns` / `cursor-nw` / `cursor-nwse` / `cursor-out` / `cursor-pointer` / `cursor-progress` / `cursor-row` / `cursor-s` / `cursor-scroll` / `cursor-se` / `cursor-sw` / `cursor-text` / `cursor-vtext` / `cursor-w` / `cursor-wait`

#### Display mode <!-- notoc -->

`db` / `di` / `dib` / `dif` / `dig` / `dn` / `dt` / `dtc` / `dtr` / `flex` / `grid`

#### Flex layout <!-- notoc -->

`align-content-center` / `align-content-end` / `align-content-start` / `flex-column` / `flex-column-reverse` / `flex-grow0` / `flex-grow1` / `flex-nowrap` / `flex-row` / `flex-row-reverse` / `flex-shrink0` / `flex-shrink1` / `flex-wrap` / `flex-wrap-reverse` / `justify-content-center` / `justify-content-end` / `justify-content-start`

#### Font families <!-- notoc -->

`monospace` / `sans-serif` / `serif` / `system` / `system-sans-serif` / `system-serif`

#### Font sizes <!-- notoc -->

`f-subtitle` / `f-title` / `f1` / `f2` / `f3` / `f4` / `f5` / `f6` / `f7`

#### Font style <!-- notoc -->

`italic`

#### Font variants <!-- notoc -->

`small-caps`

#### Font weights <!-- notoc -->

`b` / `fw100` / `fw200` / `fw300` / `fw400` / `fw500` / `fw600` / `fw700` / `fw800` / `fw900` / `normal`

#### Grid layout <!-- notoc -->

`align-items-center` / `align-items-end` / `align-items-start` / `align-items-stretch` / `align-self-center` / `align-self-end` / `align-self-start` / `align-self-stretch` / `gap0` / `gap1` / `gap2` / `gap3` / `gap4` / `gap5` / `gap-1px` / `gap-2px` / `gap-4px` / `gap-8px` / `grid-cols-1` / `grid-cols-2` / `grid-cols-3` / `grid-cols-4` / `grid-cols-5` / `grid-cols-6` / `grid-cols-7` / `grid-cols-8` / `grid-cols-9` / `grid-cols-10` / `grid-rows-1` / `grid-rows-2` / `grid-rows-3` / `grid-rows-4` / `grid-rows-5` / `grid-rows-6` / `grid-rows-7` / `grid-rows-8` / `grid-rows-9` / `grid-rows-10` / `justify-items-center` / `justify-items-end` / `justify-items-start` / `justify-items-stretch` / `justify-self-center` / `justify-self-end` / `justify-self-start` / `justify-self-stretch`

#### Height <!-- notoc -->

`h1` / `h2` / `h3` / `h4` / `h5` / `h-10` / `h-16` / `h-17` / `h-20` / `h-25` / `h-30` / `h-33` / `h-34` / `h-40` / `h-50` / `h-60` / `h-66` / `h-67` / `h-70` / `h-75` / `h-80` / `h-83` / `h-84` / `h-90` / `h-100` / `vh-25` / `vh-50` / `vh-75` / `vh-100`

#### Icons <!-- notoc -->

`icon-1` / `icon-2` / `icon-3` / `icon-4` / `icon-5` / `icon-6` / `icon-7` / `icon-subtitle` / `icon-title`

#### Letter spacing <!-- notoc -->

`ls-0` / `ls-1` / `ls-2` / `ls-3` / `ls--1` / `ls--2`

#### Line heights <!-- notoc -->

`lh-0` / `lh-copy` / `lh-double` / `lh-solid` / `lh-title`

#### Lists <!-- notoc -->

`list`

#### Margin <!-- notoc -->

`center` / `ma0` / `ma1` / `ma2` / `ma3` / `ma4` / `ma5` / `mb0` / `mb1` / `mb2` / `mb3` / `mb4` / `mb5` / `mbe-0` / `mbe-1` / `mbe-2` / `mbe-3` / `mbe-4` / `mbe-5` / `mbs-0` / `mbs-1` / `mbs-2` / `mbs-3` / `mbs-4` / `mbs-5` / `mh0` / `mh1` / `mh2` / `mh3` / `mh4` / `mh5` / `ml0` / `ml1` / `ml2` / `ml3` / `ml4` / `ml5` / `mr0` / `mr1` / `mr2` / `mr3` / `mr4` / `mr5` / `mt0` / `mt1` / `mt2` / `mt3` / `mt4` / `mt5` / `mv0` / `mv1` / `mv2` / `mv3` / `mv4` / `mv5`

#### Max. height <!-- notoc -->

`maxh1` / `maxh2` / `maxh3` / `maxh4` / `maxh5` / `maxh-10` / `maxh-16` / `maxh-17` / `maxh-20` / `maxh-25` / `maxh-30` / `maxh-33` / `maxh-34` / `maxh-40` / `maxh-50` / `maxh-60` / `maxh-66` / `maxh-67` / `maxh-70` / `maxh-75` / `maxh-80` / `maxh-83` / `maxh-84` / `maxh-90` / `maxh-100`

#### Max. width <!-- notoc -->

`maxw1` / `maxw2` / `maxw3` / `maxw4` / `maxw5` / `maxw-10` / `maxw-16` / `maxw-17` / `maxw-20` / `maxw-25` / `maxw-30` / `maxw-33` / `maxw-34` / `maxw-40` / `maxw-50` / `maxw-60` / `maxw-66` / `maxw-67` / `maxw-70` / `maxw-75` / `maxw-80` / `maxw-83` / `maxw-84` / `maxw-90` / `maxw-100`

#### Min. height <!-- notoc -->

`minh1` / `minh2` / `minh3` / `minh4` / `minh5` / `minh-10` / `minh-16` / `minh-17` / `minh-20` / `minh-25` / `minh-30` / `minh-33` / `minh-34` / `minh-40` / `minh-50` / `minh-60` / `minh-66` / `minh-67` / `minh-70` / `minh-75` / `minh-80` / `minh-83` / `minh-84` / `minh-90` / `minh-100`

#### Min. width <!-- notoc -->

`minw1` / `minw2` / `minw3` / `minw4` / `minw5` / `minw-10` / `minw-16` / `minw-17` / `minw-20` / `minw-25` / `minw-30` / `minw-33` / `minw-34` / `minw-40` / `minw-50` / `minw-60` / `minw-66` / `minw-67` / `minw-70` / `minw-75` / `minw-80` / `minw-83` / `minw-84` / `minw-90` / `minw-100`

#### Overflow <!-- notoc -->

`overflow-auto` / `overflow-hidden` / `overflow-scroll` / `overflow-visible` / `overflow-x-auto` / `overflow-x-hidden` / `overflow-x-scroll` / `overflow-x-visible` / `overflow-y-auto` / `overflow-y-hidden` / `overflow-y-scroll` / `overflow-y-visible`

#### Padding <!-- notoc -->

`pa0` / `pa1` / `pa2` / `pa3` / `pa4` / `pa5` / `pb0` / `pb1` / `pb2` / `pb3` / `pb4` / `pb5` / `pbe-0` / `pbe-1` / `pbe-2` / `pbe-3` / `pbe-4` / `pbe-5` / `pbs-0` / `pbs-1` / `pbs-2` / `pbs-3` / `pbs-4` / `pbs-5` / `ph0` / `ph1` / `ph2` / `ph3` / `ph4` / `ph5` / `pl0` / `pl1` / `pl2` / `pl3` / `pl4` / `pl5` / `pr0` / `pr1` / `pr2` / `pr3` / `pr4` / `pr5` / `pt0` / `pt1` / `pt2` / `pt3` / `pt4` / `pt5` / `pv0` / `pv1` / `pv2` / `pv3` / `pv4` / `pv5`

#### Positions <!-- notoc -->

`absolute` / `bottom-0` / `bottom-1` / `bottom-2` / `bottom--1` / `bottom--2` / `fixed` / `left-0` / `left-1` / `left-2` / `left--1` / `left--2` / `relative` / `right-0` / `right-1` / `right-2` / `right--1` / `right--2` / `static` / `sticky` / `top-0` / `top-1` / `top-2` / `top--1` / `top--2`

#### Print <!-- notoc -->

`break-after-avoid` / `break-after-avoid-column` / `break-after-avoid-page` / `break-after-column` / `break-after-left` / `break-after-page` / `break-after-recto` / `break-after-right` / `break-after-verso` / `break-before-avoid` / `break-before-avoid-column` / `break-before-avoid-page` / `break-before-column` / `break-before-left` / `break-before-page` / `break-before-recto` / `break-before-right` / `break-before-verso`

#### Scrolling <!-- notoc -->

`ss-always` / `ss-both` / `ss-center` / `ss-end` / `ss-normal` / `ss-start` / `ss-x` / `ss-y`

#### Selection <!-- notoc -->

`noselect`

#### Shadow <!-- notoc -->

`box-shadow-1` / `box-shadow-2` / `box-shadow-3` / `box-shadow-4` / `box-shadow-i-1` / `box-shadow-i-2` / `box-shadow-i-3` / `box-shadow-i-4` / `text-shadow-1` / `text-shadow-2` / `text-shadow-3` / `text-shadow-4` / `text-shadow-5` / `text-shadow-6` / `text-shadow-7` / `text-shadow-8` / `text-shadow-9`

#### Text align <!-- notoc -->

`tc` / `tj` / `tl` / `tr`

#### Text decorations <!-- notoc -->

`no-underline` / `strike` / `underline`

#### Text transforms <!-- notoc -->

`ttc` / `ttfsk` / `ttfw` / `tti` / `ttl` / `ttn` / `ttu`

#### Vertical align <!-- notoc -->

`v-base` / `v-btm` / `v-mid` / `v-top`

#### Visibility <!-- notoc -->

`collapse` / `hidden` / `visible`

#### Whitespace <!-- notoc -->

`ws-0` / `ws-1` / `ws-2`

#### Width <!-- notoc -->

`vw-25` / `vw-50` / `vw-75` / `vw-100` / `w1` / `w2` / `w3` / `w4` / `w5` / `w-10` / `w-16` / `w-17` / `w-20` / `w-25` / `w-30` / `w-33` / `w-34` / `w-40` / `w-50` / `w-60` / `w-66` / `w-67` / `w-70` / `w-75` / `w-80` / `w-83` / `w-84` / `w-90` / `w-100`

#### Z-indices <!-- notoc -->

`z-0` / `z-1` / `z-2` / `z-3` / `z-4` / `z-5` / `z-999` / `z-9999`

### Media queries

- **ns**: `{"min-width":"30rem"}`
- **m**: `{"min-width":"30rem","max-width":"60rem"}`
- **l**: `{"min-width":"60rem"}`
- **dark**: `{"prefers-color-scheme":"dark"}`
- **light**: `{"prefers-color-scheme":"light"}`
- **anim**: `{"prefers-reduced-motion":false}`
- **noanim**: `{"prefers-reduced-motion":true}`

## Status

**ALPHA** - bleeding edge / work-in-progress

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Bmeta-css%5D+in%3Atitle)

## Related packages

- [@thi.ng/hiccup-css](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-css) - CSS from nested JS data structures

## Installation

```bash
npx @thi.ng/meta-css --help
```

[Bun](https://bun.sh) is required instead of Node JS. The toolchain itself is
distributed as CLI bundle with **no runtime dependencies**. The following
dependencies are only shown for informational purposes and are (partially)
included in the bundle.

Package sizes (brotli'd, pre-treeshake): ESM: 12.30 KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/args](https://github.com/thi-ng/umbrella/tree/develop/packages/args)
- [@thi.ng/arrays](https://github.com/thi-ng/umbrella/tree/develop/packages/arrays)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/develop/packages/errors)
- [@thi.ng/file-io](https://github.com/thi-ng/umbrella/tree/develop/packages/file-io)
- [@thi.ng/hiccup-css](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-css)
- [@thi.ng/logger](https://github.com/thi-ng/umbrella/tree/develop/packages/logger)
- [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
- [@thi.ng/strings](https://github.com/thi-ng/umbrella/tree/develop/packages/strings)
- [@thi.ng/text-format](https://github.com/thi-ng/umbrella/tree/develop/packages/text-format)
- [@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers)

## Usage examples

Several projects in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory are using this package:

| Screenshot                                                                                                             | Description                                            | Live demo                                             | Source                                                                             |
|:-----------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------|:------------------------------------------------------|:-----------------------------------------------------------------------------------|
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/blurhash.jpg" width="240"/>        | Interactive & reactive image blurhash generator        | [Demo](https://demo.thi.ng/umbrella/blurhash/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/blurhash)        |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/layout-gridgen.png" width="240"/>  | Randomized space-filling, nested grid layout generator | [Demo](https://demo.thi.ng/umbrella/layout-gridgen/)  | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/layout-gridgen)  |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/meta-css-basics.png" width="240"/> | Basic thi.ng/meta-css usage & testbed                  | [Demo](https://demo.thi.ng/umbrella/meta-css-basics/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/meta-css-basics) |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rdom-dnd.png" width="240"/>        | rdom drag & drop example                               | [Demo](https://demo.thi.ng/umbrella/rdom-dnd/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rdom-dnd)        |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rdom-lazy-load.png" width="240"/>  | Lazy loading components via @thi.ng/rdom               | [Demo](https://demo.thi.ng/umbrella/rdom-lazy-load/)  | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rdom-lazy-load)  |

## Authors

- [Karsten Schmidt](https://thi.ng)

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-meta-css,
  title = "@thi.ng/meta-css",
  author = "Karsten Schmidt",
  note = "https://thi.ng/meta-css",
  year = 2023
}
```

## License

&copy; 2023 - 2024 Karsten Schmidt // Apache License 2.0
