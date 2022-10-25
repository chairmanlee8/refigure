# refigure

Opinionated fixed-width formatting of arbitrary precision, high dynamic ranges of numbers. Useful for number columns in tables, e.g.

Some design goals with this library:

- Formatted numbers should be unambiguous, concise, and quick to distinguish visually
- Big numbers should always seem big
- Small number should always seem small

## Install

```sh
npm install refigure
```

## Usage

```ts
import { BigNumber } from 'bignumber.js';
import { refigure } from 'refigure';

refigure(BigNumber(1)); 
// '   1        '
refigure(BigNumber(571.6));
// ' 571.6      '
refigure(BigNumber(1001));
// '   1.001   k'
refigure(BigNumber(0.1487213));
// '   0.1487   '
refigure(BigNumber(312.3e-12));
// '   0.3123  n'
refigure(BigNumber(0));
// '   0        '
refigure(BigNumber(-3.4));
// '  (3.4)     '
refigure(BigNumber(-173023));
// '(173)      k'
```
## API

TODO