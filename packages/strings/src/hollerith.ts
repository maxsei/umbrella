import { Stringer } from "./api";

/**
 * Formats given value `x` as Fortran style Hollerith string.
 *
 * ```ts
 * hstr("abc")  // "3Habc"
 * hstr(123.45) // "6H123.45"
 * hstr("")     // "0H"
 * hstr(null)   // ""
 * ```
 *
 * {@link https://en.wikipedia.org/wiki/Hollerith_constant}
 *
 * @param x -
 */
export const hstr: Stringer<any> = (x) =>
    x != null ? ((x = x.toString()), `${x.length}H${x}`) : "";
