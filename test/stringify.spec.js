'use strict';

const test = require('tape').test;
const lib = require('../lib');

test('Stringify method: should create string from array', t => {

  const stringArray = ['a', 'b', 'c', 'd'];

  t.equals(lib.stringify(stringArray), 'a,b,c,d');
  t.end();

});

test('Stringify method: should create string from object', t => {

  const stringObject = {
    a: ['a', 'b'],
    c: ['c', 'd'],
  };

  t.equals(lib.stringify(stringObject), 'a,b\nc,d');
  t.end();

});
