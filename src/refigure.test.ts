import refigure from './refigure.js';
import { BigNumber } from 'bignumber.js';

test('refigure', () => {
  function refigure_(s: string | number): string {
    return refigure(new BigNumber(s));
  }
  // >= 1
  expect(refigure_('1')).toEqual(/*--------------*/ '   1        ');
  expect(refigure_('1.0000123')).toEqual(/*------*/ '   1        ');
  expect(refigure_('3.4')).toEqual(/*------------*/ '   3.4      ');
  expect(refigure_('31.22')).toEqual(/*----------*/ '  31.22     ');
  expect(refigure_('571.5983')).toEqual(/*-------*/ ' 571.6      ');
  expect(refigure_('1001')).toEqual(/*-----------*/ '   1.001   k');
  expect(refigure_('173023')).toEqual(/*---------*/ ' 173       k');
  expect(refigure_('13874.12387871')).toEqual(/*-*/ '  13.87    k');
  expect(refigure_('1000000000')).toEqual(/*-----*/ '   1       G');
  // < 1
  expect(refigure_('0.1487213')).toEqual(/*------*/ '   0.1487   ');
  expect(refigure_('0.13')).toEqual(/*-----------*/ '   0.13     ');
  expect(refigure_('0.09763139')).toEqual(/*-----*/ '   0.0976   ');
  expect(refigure_('0.00141414')).toEqual(/*-----*/ '   0.0014   ');
  expect(refigure_('0.000999999')).toEqual(/*----*/ '   0.001    ');
  expect(refigure_('0.0000999999')).toEqual(/*---*/ '   0.1     m');
  expect(refigure_('0.000001251231')).toEqual(/*-*/ '   0.0013  m');
  expect(refigure_('0.0000001251231')).toEqual(/**/ '   0.1251  μ');
  expect(refigure_('312.3e-12')).toEqual(/*------*/ '   0.3123  n');
  // 0
  expect(refigure_('0')).toEqual(/*--------------*/ '   0        ');
  // < 0
  expect(refigure_('-1')).toEqual(/*-------------*/ '  (1)       ');
  expect(refigure_('-1.0000123')).toEqual(/*-----*/ '  (1)       ');
  expect(refigure_('-3.4')).toEqual(/*-----------*/ '  (3.4)     ');
  expect(refigure_('-1001')).toEqual(/*----------*/ '  (1.001)  k');
  expect(refigure_('-173023')).toEqual(/*--------*/ '(173)      k');
  expect(refigure_('-0.1487213')).toEqual(/*-----*/ '  (0.1487)  ');
  expect(refigure_('-0.09763139')).toEqual(/*----*/ '  (0.0976)  ');
  expect(refigure_('-0.00141414')).toEqual(/*----*/ '  (0.0014)  ');
  expect(refigure_('-0.000999999')).toEqual(/*---*/ '  (0.001)   ');
  expect(refigure_('-0.000001251231')).toEqual(/**/ '  (0.0013) m');
  expect(refigure_('-312.3e-12')).toEqual(/*-----*/ '  (0.3123) n');
  // Exceptions
  expect(refigure_('9.999e18')).toEqual(/*-------*/ '   9.999   E');
  expect(refigure_('10e19')).toEqual(/*----------*/ 'OVER        ');
  expect(refigure_('10e-18')).toEqual(/*---------*/ '   0.01    f');
  expect(refigure_('9.999e-18')).toEqual(/*------*/ '       UNDER');
  expect(refigure_(Infinity)).toEqual(/*---------*/ ' INFINITY   ');
  expect(refigure_(-Infinity)).toEqual(/*--------*/ '(INFINITY)  ');
  expect(refigure_(NaN)).toEqual(/*--------------*/ ' NaN        ');
});
