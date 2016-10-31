'use strict';

const test = require('tape').test;
const lib = require('../lib');

test('Expand method: should expand an array', t => {

  const mixed = ['u s a', 'usa', 'united states of america'];

  t.equals(lib.expand(mixed),
    'u s a,usa,united states of america => u s a,usa,united states of america');
  t.end();

});
