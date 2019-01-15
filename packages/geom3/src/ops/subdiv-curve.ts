import { defmulti, MultiFn2O } from "@thi.ng/defmulti";
import { wrap } from "@thi.ng/transducers";
import { mixN, ReadonlyVec } from "@thi.ng/vectors3";
import {
    IShape,
    Polygon,
    Polyline,
    SubdivKernel,
    Type
} from "../api";
import { dispatch } from "../internal/dispatch";
import { subdivCurvePoints, subdivKernel3 } from "../internal/subdiv-curve";

const CHAIKIN_FIRST = subdivKernel3([1 / 2, 1 / 2, 0], [0, 3 / 4, 1 / 4]);
const CHAIKIN_MAIN = subdivKernel3([1 / 4, 3 / 4, 0], [0, 3 / 4, 1 / 4]);
const CHAIKIN_LAST = subdivKernel3([1 / 4, 3 / 4, 0], [0, 1 / 2, 1 / 2]);
const CUBIC_MAIN = subdivKernel3([1 / 8, 3 / 4, 1 / 8], [0, 1 / 2, 1 / 2]);

const MIDP = ([a, b]: ReadonlyVec[]) => [a, mixN([], a, b, 0.5)];
const THIRDS = ([a, b]: ReadonlyVec[]) => [a, mixN([], a, b, 1 / 3), mixN([], a, b, 2 / 3)];

const wrap2 = (pts: ReadonlyVec[]) => wrap(pts, 1, false, true);
const wrap3 = (pts: ReadonlyVec[]) => wrap(pts, 1, true, true);

export const SUBDIV_MID_OPEN: SubdivKernel = {
    fn: (pts, i, n) => i < n - 2 ? MIDP(pts) : [...MIDP(pts), pts[1]],
    size: 2
};

export const SUBDIV_MID_CLOSED: SubdivKernel = {
    fn: MIDP,
    iter: wrap2,
    size: 2
};

export const SUBDIV_THIRDS_OPEN: SubdivKernel = {
    fn: (pts, i, n) => i < n - 2 ? THIRDS(pts) : [...THIRDS(pts), pts[1]],
    size: 2
};

export const SUBDIV_THIRDS_CLOSED: SubdivKernel = {
    fn: THIRDS,
    iter: wrap2,
    size: 2
};

export const SUBDIV_CHAIKIN_OPEN: SubdivKernel = {
    fn: (pts, i, n) =>
        i == 0 ?
            [pts[0], ...CHAIKIN_FIRST(pts)] :
            i === n - 3 ?
                [...CHAIKIN_LAST(pts), pts[2]] :
                CHAIKIN_MAIN(pts),
    size: 3
};

export const SUBDIV_CHAIKIN_CLOSED: SubdivKernel = {
    fn: CHAIKIN_MAIN,
    iter: wrap3,
    size: 3
};

export const SUBDIV_CUBIC_CLOSED: SubdivKernel = {
    fn: CUBIC_MAIN,
    iter: wrap3,
    size: 3
};

export const subdivCurve: MultiFn2O<IShape, SubdivKernel, number, IShape> = defmulti(dispatch);

subdivCurve.addAll({

    [Type.POLYGON]:
        (poly: Polygon, kernel, iter = 1) =>
            new Polygon(
                subdivCurvePoints(poly.points, kernel, iter),
                { ...poly.attribs }
            ),

    [Type.POLYLINE]:
        (line: Polyline, kernel, iter = 1) =>
            new Polyline(
                subdivCurvePoints(line.points, kernel, iter),
                { ...line.attribs }
            ),

});
