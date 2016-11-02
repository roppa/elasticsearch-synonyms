'use strict';

const test = require('tape').test;
const lib = require('../lib');

test('Contract method: should return list of words', t => {

  const stringArray = ['a', 'b', 'c', 'd'];

  t.equals(lib.contract(stringArray), 'a,b,c,d');
  t.end();

});

test('Contract method: should return word with fat arrow', t => {

  const stringArray = ['a', 'b b', 'c', 'd'];

  t.equals(lib.contract(stringArray), 'a,c,d,b b => a');
  t.end();

});

test('Contract method: phrase only should be expanded', t => {

  const stringArray = ['a a', 'b b', 'c c', 'd d'];

  t.equals(lib.contract(stringArray), 'a a,b b,c c,d d => a a,b b,c c,d d');
  t.end();

});
