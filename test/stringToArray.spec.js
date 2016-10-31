'use strict';

const test = require('tape').test;
const lib = require('../lib');

test('stringToArray method: should process uncommented list', t => {

  const list = 'a,b\nc,d';
  const empty = '';
  const whitespace = '\n\n ';

  t.deepEqual(lib.stringToArray(list), ['a,b', 'c,d']);
  t.deepEqual(lib.stringToArray(empty), []);
  t.deepEqual(lib.stringToArray(whitespace), []);
  t.end();

});

test('stringToArray method: should remove comments and return an array', t => {

  const allComments = '#test\n#test\n';
  const commentedtext = '#test\na\n#test\nb';

  t.deepEqual(lib.stringToArray(allComments), []);
  t.deepEqual(lib.stringToArray(commentedtext), ['a', 'b']);
  t.end();

});
