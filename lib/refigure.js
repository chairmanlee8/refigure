// Unambiguous, concise, quick to distinguish, easily aligned display
// of monetary figures spanning 10^-18 to 10^18
//
// Big numbers should always seem big
// Small numbers should always seem small
// That is, numbers > 1 should never lead with 0., numbers < 1 should always lead with .
// For 4 sig figs, use inverted comma to delineate the millis place
// CR-someday: the restriction that numbers < 1 should always lead with 0, combined
// with the restriction on decimal places, means that we lose sig figs for groups
// not evenly modulo 4.  Is this the right trade-off to make?
// CR: TODO configure the suffix to be immediately after (don't pad out); also, with highlight/color (green for Big, red for small)
// CR: TODO configure the field width
// CR: TODO configure allow the suffix to come out separately (3 mBTC instead of 3m BTC, in separate columns). And for USD, ignore subcents (smallest value $.00 or $.0000)
// CR-someday: before publication, it needs to support both BigNumber and number; in fact, BigNumber should be an optional linkage
import { BigNumber } from 'bignumber.js';
import assert from 'assert';
const MAX_MAGNITUDE_EXCLUSIVE = new BigNumber('10e19');
const MIN_MAGNITUDE_INCLUSIVE = new BigNumber('10e-18');
const POS_INFINITY = new BigNumber(Infinity);
const NEG_INFINITY = new BigNumber(-Infinity);
const PREFIX_LOW = [' ', 'm', 'μ', 'n', 'p', 'f', 'a'];
const PREFIX_HIGH = [' ', 'k', 'M', 'G', 'T', 'P', 'E'];
// Pad left to 3 digits, pad right to 5 digits (incl. decimal point position)
// Add parens as isNegative
function format(nstr, isNegative, prefix) {
    let dp = nstr.length;
    for (let i = 0; i < nstr.length; i++) {
        if (nstr[i] === '.') {
            dp = i;
            break;
        }
    }
    const lpad = ''.padStart(Math.max(0, 3 - dp), ' ');
    const rpad = ''.padStart(Math.max(0, 5 - (nstr.length - dp)), ' ');
    if (isNegative) {
        return `${lpad}(${nstr})${rpad} ${prefix}`;
    }
    else {
        return ` ${lpad}${nstr}${rpad}  ${prefix}`;
    }
}
export default function refigure(value) {
    if (value.isZero()) {
        return format('0', false, ' ');
    }
    else if (value.isNaN()) {
        return ' NaN        ';
    }
    else if (value.isEqualTo(POS_INFINITY)) {
        return ' INFINITY   ';
    }
    else if (value.isEqualTo(NEG_INFINITY)) {
        return '(INFINITY)  ';
    }
    else {
        const significant = value.precision(4, BigNumber.ROUND_HALF_EVEN);
        const isNegative = significant.isNegative();
        const magnitude = significant.absoluteValue();
        if (magnitude.isGreaterThanOrEqualTo(MAX_MAGNITUDE_EXCLUSIVE)) {
            return 'OVER        ';
        }
        else if (magnitude.isLessThan(MIN_MAGNITUDE_INCLUSIVE)) {
            return '       UNDER';
        }
        else if (magnitude.isGreaterThanOrEqualTo(1)) {
            // CR: magnitude.dp() might be null if magnitude is NaN or +/- Infinity;
            // same issue occurs twice below
            const magnitudeDp = magnitude.dp();
            assert(magnitudeDp !== null);
            const digits = magnitude.sd(true) - magnitudeDp;
            let groups = Math.floor(digits / 3);
            if (groups > 0 && digits % 3 === 0) {
                // numbers > 1 should never lead with 0.
                groups -= 1;
            }
            return format(magnitude.shiftedBy(-groups * 3).toFixed(), isNegative, PREFIX_HIGH[groups]);
        }
        else {
            const magnitudeDp = magnitude.dp();
            assert(magnitudeDp !== null);
            const zeroes = magnitudeDp - magnitude.sd();
            const groups = Math.floor(zeroes / 3);
            const shifted = magnitude.shiftedBy(groups * 3);
            const shiftedDp = shifted.dp();
            assert(shiftedDp !== null);
            const dp = Math.min(shiftedDp, 4);
            return format(magnitude.shiftedBy(groups * 3).toFixed(dp, BigNumber.ROUND_HALF_EVEN), isNegative, PREFIX_LOW[groups]);
        }
    }
}
