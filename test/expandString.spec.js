'use strict';

const test = require('tape').test;
const lib = require('../lib');

test('ExpandString method: should expand string', t => {

  const empty = '';
  const string = 'wood bark tree splinter';
  const whitespace = '   wood    bark    tree    splinter   ';

  t.equals(lib.expandString(string), 'wood,bark,tree,splinter');
  t.equals(lib.expandString(whitespace), 'wood,bark,tree,splinter');

  t.end();

});
