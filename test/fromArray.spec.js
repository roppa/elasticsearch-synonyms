'use strict';

const test = require('tape').test;
const lib = require('../lib');

test('FromArray method: should return list of words', t => {

  const stringArray = ['a', 'b', 'c', 'd'];

  t.equals(lib.fromArray(stringArray), 'a,b,c,d');
  t.end();

});

test('FromArray method: should return word with fat arrow', t => {

  const stringArray = ['a', 'b b', 'c', 'd'];

  t.equals(lib.fromArray(stringArray), 'a,c,d,b b => a');
  t.end();

});

test('FromArray method: phrase only should be expanded', t => {

  const stringArray = ['a a', 'b b', 'c c', 'd d'];

  t.equals(lib.fromArray(stringArray), 'a a,b b,c c,d d => a a,b b,c c,d d');
  t.end();

});
