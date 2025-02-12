import type { FnU } from "@thi.ng/api";
import { deref, isDeref } from "@thi.ng/api/deref";
import { implementsFunction } from "@thi.ng/checks/implements-function";
import { isArray } from "@thi.ng/checks/is-array";
import { isFunction } from "@thi.ng/checks/is-function";
import { isNotStringAndIterable } from "@thi.ng/checks/is-not-string-iterable";
import { isPlainObject } from "@thi.ng/checks/is-plain-object";
import { isString } from "@thi.ng/checks/is-string";
import { illegalArgs } from "@thi.ng/errors/illegal-arguments";
import { escapeEntitiesNum } from "@thi.ng/strings/entities";
import {
	ATTRIB_JOIN_DELIMS,
	CDATA,
	COMMENT,
	NO_CLOSE_EMPTY,
	NO_SPANS,
	PROC_TAGS,
	VOID_TAGS,
} from "./api.js";
import { css } from "./css.js";
import { normalize } from "./normalize.js";
import { formatPrefixes } from "./prefix.js";

/**
 * Options to customize the behavior of {@link serialize}.
 */
export interface SerializeOpts {
	/**
	 * Arbitrary user context object
	 */
	ctx?: any;
	/**
	 * If true, auto-escape entities via {@link SerializeOpts.escapeFn}.
	 *
	 * @defaultValue false
	 */
	escape: boolean;
	/**
	 * Only used if {@link SerializeOpts.escape} is enabled. Function to escape
	 * entities. By default uses
	 * [`escapeEntitiesNum()`](https://docs.thi.ng/umbrella/strings/functions/escapeEntitiesNum.html).
	 */
	escapeFn: FnU<string>;
	/**
	 * If true (default: false), all text content will be wrapped in `<span>`
	 * elements (to ensure DOM compatibility with hdom). The only elements for
	 * spans are never created are listed in {@link NO_SPANS}.
	 *
	 * @defaultValue false
	 */
	span: boolean;
	/**
	 * If true (default: false), all elements will have an autogenerated `key`
	 * attribute injected. If {@link SerializeOpts.span} is enabled, `keys` will
	 * be enabled by default too (since in this case we assume the output is
	 * meant to be compatible with [`thi.ng/hdom`](https://thi.ng/hdom)).
	 *
	 * @defaultValue false
	 */
	keys: boolean;
}

/**
 * Recursively normalizes and serializes given tree as HTML/SVG/XML string.
 * Expands any embedded component functions with their results.
 *
 * @remarks
 * Each node of the input tree can have one of the following input forms:
 *
 * ```js
 * ["tag", ...]
 * ["tag#id.class1.class2", ...]
 * ["tag", {other: "attrib"}, ...]
 * ["tag", {...}, "body", function, ...]
 * [function, arg1, arg2, ...]
 * [{render: (ctx,...) => [...]}, args...]
 * iterable
 * ```
 *
 * Tags can be defined in "Emmet" convention, e.g.
 *
 * ```js
 * ["div#foo.bar.baz", "hi"] // <div id="foo" class="bar baz">hi</div>
 * ```
 *
 * The presence of the attributes object (2nd array index) is optional. Any
 * attribute values, incl. functions are allowed. If the latter, the function is
 * called with the full attribs object as argument and the return value is used
 * for the attribute. This allows for the dynamic creation of attrib values
 * based on other attribs. The only exception to this are event attributes, i.e.
 * attribute names starting with "on". Function values assigned to event
 * attributes will be omitted from the output.
 *
 * ```js
 * ["div#foo", { bar: (attribs) => attribs.id + "-bar" }]
 * // <div id="foo" bar="foo-bar"></div>
 * ```
 *
 * The `style` attribute can ONLY be defined as string or object.
 *
 * ```js
 * ["div", { style: { color: "red", background: "#000" } }]
 * // <div style="color:red;background:#000;"></div>
 * ```
 *
 * Boolean attribs are serialized in HTML5 syntax (present or not). `null`,
 * `undefined` or empty string attrib values are ignored.
 *
 * Any `null` or `undefined` array values (other than in head position) will
 * also be removed, unless a function is in head position.
 *
 * A function in head position of a node acts as a mechanism for component
 * composition & delayed execution. The function will only be executed at
 * serialization time. In this case the optional global context object and all
 * other elements of that node / array are passed as arguments when that
 * function is called. The return value the function MUST be a valid new tree
 * (or `undefined`).
 *
 * If the `ctx` option is given it'll be passed to each embedded component fns.
 * Optionally call {@link derefContext} prior to `serialize()` to auto-deref
 * context keys with values implementing the
 * [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html)
 * interface.
 *
 * ```js
 * const foo = (ctx, a, b) => ["div#" + a, ctx.foo, b];
 *
 * serialize([foo, "id", "body"], { ctx: { foo: { class: "black" } } })
 * // <div id="id" class="black">body</div>
 * ```
 *
 * Functions located in other positions are called ONLY with the global context
 * arg and can return any (serializable) value (i.e. new trees, strings,
 * numbers, iterables or any type with a suitable `.toString()`, `.toHiccup()`
 * or `.deref()` implementation).
 *
 * hiccup & hdom control attributes (i.e. attrib names prefixed with `__`) will
 * be omitted from the output. The only control attrib supported by this package
 * is `__serialize`. If set to `false`, the entire tree branch below (and
 * including) the element with that attrib will be excluded from the output.
 *
 * **See {@link SerializeOpts} for further available options.**
 *
 * Single or multiline comments can be included using the special `COMMENT` tag
 * (`"__COMMENT__"`) (always WITHOUT attributes!).
 *
 * ```js
 * [COMMENT, "Hello world"]
 * // <!-- Hello world -->
 *
 * [COMMENT, "Hello", "world"]
 * // <!--
 * //     Hello
 * //     world
 * // -->
 * ```
 *
 * Currently, the only processing / DTD instructions supported are:
 *
 * - `?xml`
 * - `!DOCTYTPE`
 * - `!ELEMENT`
 * - `!ENTITY`
 * - `!ATTLIST`
 *
 * These are used as follows (attribs are only allowed for `?xml`, all others
 * only accept a body string which is taken as is):
 *
 * ```js
 * serialize(["?xml", { version: "1.0", standalone: "yes" }])
 * // <?xml version="1.0" standalone="yes"?>
 *
 * ["!DOCTYPE", "html"] // (also available as DOCTYPE_HTML)
 * // <!DOCTYPE html>
 * ```
 *
 * @param tree - hiccup elements / component tree
 * @param opts - options
 */
export const serialize = (
	tree: any,
	opts?: Partial<SerializeOpts>,
	path = [0]
) => {
	const $opts = {
		escape: false,
		escapeFn: escapeEntitiesNum,
		span: false,
		keys: false,
		...opts,
	};
	if (opts?.keys == null && $opts.span) $opts.keys = true;
	return _serialize(tree, $opts, path);
};

const _serialize = (tree: any, opts: SerializeOpts, path: any[]): string =>
	tree == null
		? ""
		: Array.isArray(tree)
		? serializeElement(tree, opts, path)
		: isFunction(tree)
		? _serialize(tree(opts.ctx), opts, path)
		: implementsFunction(tree, "toHiccup")
		? _serialize(tree.toHiccup(opts.ctx), opts, path)
		: isDeref(tree)
		? _serialize(tree.deref(), opts, path)
		: isNotStringAndIterable(tree)
		? serializeIter(tree, opts, path)
		: ((tree = __escape(String(tree), opts)), opts.span)
		? `<span${opts.keys ? ` key="${path.join("-")}"` : ""}>${tree}</span>`
		: tree;

const serializeElement = (tree: any[], opts: SerializeOpts, path: any[]) => {
	let tag = tree[0];
	return !tree.length
		? ""
		: isFunction(tag)
		? _serialize(tag.apply(null, [opts.ctx, ...tree.slice(1)]), opts, path)
		: implementsFunction(tag, "render")
		? _serialize(
				tag.render.apply(null, [opts.ctx, ...tree.slice(1)]),
				opts,
				path
		  )
		: tag === COMMENT
		? serializeComment(tree)
		: tag == CDATA
		? serializeCData(tree)
		: isString(tag)
		? serializeTag(tree, opts, path)
		: isNotStringAndIterable(tree)
		? serializeIter(tree, opts, path)
		: illegalArgs(`invalid tree node: ${tree}`);
};

const serializeTag = (tree: any[], opts: SerializeOpts, path: any[]) => {
	tree = normalize(tree);
	const attribs = tree[1];
	if (attribs.__skip || attribs.__serialize === false) return "";
	opts.keys && attribs.key === undefined && (attribs.key = path.join("-"));
	const tag = tree[0];
	const body = tree[2]
		? serializeBody(tag, tree[2], opts, path)
		: !VOID_TAGS[tag] && !NO_CLOSE_EMPTY[tag]
		? `></${tag}>`
		: PROC_TAGS[tag] || "/>";
	return `<${tag}${serializeAttribs(attribs, opts)}${body}`;
};

const serializeAttribs = (attribs: any, opts: SerializeOpts) => {
	let res = "";
	for (let a in attribs) {
		if (a.startsWith("__")) continue;
		const v = serializeAttrib(attribs, a, deref(attribs[a]), opts);
		v != null && (res += v);
	}
	return res;
};

const serializeAttrib = (
	attribs: any,
	a: string,
	v: any,
	opts: SerializeOpts
) => {
	return v == null
		? null
		: isFunction(v) && (/^on\w+/.test(a) || (v = v(attribs)) == null)
		? null
		: v === true
		? " " + a
		: v === false
		? null
		: a === "data"
		? serializeDataAttribs(v, opts)
		: attribPair(a, v, opts);
};

const attribPair = (a: string, v: any, opts: SerializeOpts) => {
	v =
		a === "style" && isPlainObject(v)
			? css(v)
			: a === "prefix" && isPlainObject(v)
			? formatPrefixes(v)
			: isArray(v)
			? v.join(ATTRIB_JOIN_DELIMS[a] || " ")
			: v.toString();
	return v.length ? ` ${a}="${__escape(v, opts)}"` : null;
};

const serializeDataAttribs = (data: any, opts: SerializeOpts) => {
	let res = "";
	for (let id in data) {
		let v = deref(data[id]);
		isFunction(v) && (v = v(data));
		v != null && (res += ` data-${id}="${__escape(v, opts)}"`);
	}
	return res;
};

const serializeBody = (
	tag: string,
	body: any[],
	opts: SerializeOpts,
	path: any[]
) => {
	if (VOID_TAGS[tag]) {
		illegalArgs(`No body allowed in tag: ${tag}`);
	}
	const proc = PROC_TAGS[tag];
	let res = proc ? " " : ">";
	if (opts.span && !proc && !NO_SPANS[tag]) opts = { ...opts, span: true };
	for (let i = 0, n = body.length; i < n; i++) {
		res += _serialize(body[i], opts, [...path, i]);
	}
	return res + (proc || `</${tag}>`);
};

const serializeComment = (tree: any[]) =>
	tree.length > 2
		? `\n<!--\n${tree
				.slice(1)
				.map((x) => "    " + x)
				.join("\n")}\n-->\n`
		: `\n<!-- ${tree[1]} -->\n`;

const serializeCData = (tree: any[]) =>
	`<![CDATA[\n${tree.slice(1).join("\n")}\n]]>`;

const serializeIter = (
	iter: Iterable<any>,
	opts: SerializeOpts,
	path: any[]
) => {
	const res: any[] = [];
	const p = path.slice(0, path.length - 1);
	let k = 0;
	for (let i of iter) {
		res.push(_serialize(i, opts, [...p, k++]));
	}
	return res.join("");
};

const __escape = (x: string, opts: SerializeOpts) =>
	opts.escape ? opts.escapeFn(x) : x;
