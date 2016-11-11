'use strict';

const test = require('tape').test;
const lib = require('../lib');
const fs = require('fs');
let sample;

test('setup', t => {
  fs.readFile('./test/sample.txt', (err, data) => {
    sample = data.toString();
    t.end();
  });
});

test('parseFile method: return an object', t => {
  t.equals(typeof lib.parseFile(sample), 'object');
  t.end();
});

test('parseFile method: should merge multiple entries', t => {

  const merge = 'a => b\na => c\na => d';

  t.deepEquals(lib.parseFile(merge), { a: ['b', 'c', 'd'] });
  t.end();

});

test('parseFile method: should process contract lhs to rhs', t => {

  const merge = 'b, c, d => a';
  const ipod = 'ipod, i-pod, i pod => ipod';

  t.deepEquals(lib.parseFile(merge), { b: ['a'], c: ['a'], d: ['a'] });
  t.deepEquals(lib.parseFile(ipod), { 'i-pod': ['ipod'], 'i pod': ['ipod'], ipod: ['ipod'] });
  t.end();

});

test('parseFile method: should process explicit mappings', t => {

  const merge = 'a, b, c => d, e, f';

  t.deepEquals(lib.parseFile(merge), {
    a: ['d', 'e', 'f'],
    b: ['d', 'e', 'f'],
    c: ['d', 'e', 'f'], });

  t.end();

});

test('parseFile method: should process explicit mappings', t => {

  const merge = 'a, b, c, d, e, f';

  t.deepEquals(lib.parseFile(merge), {
    a: ['a', 'b', 'c', 'd', 'e', 'f'],
    b: ['a', 'b', 'c', 'd', 'e', 'f'],
    c: ['a', 'b', 'c', 'd', 'e', 'f'],
    d: ['a', 'b', 'c', 'd', 'e', 'f'],
    e: ['a', 'b', 'c', 'd', 'e', 'f'],
    f: ['a', 'b', 'c', 'd', 'e', 'f'],
  });

  t.end();

});

test('parseFile method: process a file', t => {

  t.deepEquals(lib.parseFile(sample), {
    'i-pod': ['ipod', 'i-pod', 'i pod'],
    'i pod': ['ipod', 'i-pod', 'i pod'],
    ipod: ['ipod', 'i-pod', 'i pod'],
    'sea biscuit': ['seabiscuit'],
    'sea biscit': ['seabiscuit'],
    foozball: ['foozball', 'foosball'],
    foosball: ['foozball', 'foosball'],
    universe: ['universe', 'cosmos'],
    cosmos: ['universe', 'cosmos'],
    foo: ['foo bar', 'baz'],
  });

  t.end();

});
