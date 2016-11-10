'use strict';

const test = require('tape').test;
const lib = require('../lib');

test('Genre method: should throw if no ancestor', t => {

  const empty = {};

  t.throws(() => lib.genre(empty), 'You must pass a valid object');
  t.throws(() => lib.genre(null), 'You must pass a valid object');
  t.throws(() => lib.genre(undefined), 'You must pass a valid object');
  t.end();

});

test('Genre method: should expand object', t => {

  const pets = {
    pet: {
      cat: {
        kitten: 'kitten',
      },
      dog: {
        puppy: 'puppy',
      },
    },
  };
  const petString =
    'cat => cat,pet\nkitten => kitten,cat,pet\ndog => dog,pet\npuppy => puppy,dog,pet';

  t.equals(lib.genre(pets), petString);
  t.end();

});

test('Genre method: should expand deep nested object', t => {

  const pets = {
    pet: {
      cat: {
        kitten: 'kitten',
      },
      dog: {
        puppy: 'puppy',
      },
      rodent: {
        rat: 'rat',
        rabbit: 'rabbit',
        mouse: 'mouse',
      },
    },
  };

  const petString =
    'cat => cat,pet\nkitten => kitten,cat,pet\ndog => dog,pet\npuppy => puppy,dog,pet\nrodent => rodent,pet\nrat => rat,rodent,pet\nrabbit => rabbit,rodent,pet\nmouse => mouse,rodent,pet';

  t.equals(lib.genre(pets), petString);
  t.end();

});
