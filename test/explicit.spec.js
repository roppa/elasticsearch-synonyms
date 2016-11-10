'use strict';

const test = require('tape').test;
const lib = require('../lib');

test('Explicit method: should explicitly map single array', t => {

  const lhs = ['a', 'b', 'c', 'd'];

  t.equals(lib.explicit(lhs), 'a,b,c,d => a,b,c,d');
  t.end();

});

test('Explicit method: should explicitly map two arrays', t => {

  const lhs = ['a', 'b', 'c', 'd'];
  const rhs = ['e', 'f', 'g', 'h'];

  t.equals(lib.explicit(lhs, rhs), 'a,b,c,d => e,f,g,h');
  t.end();

});
