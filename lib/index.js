'use strict';

/**
 * stringToArray should process a commented file
 * @param {string} a file with \r and # comments
 * @return {array} each non-connemnted line
 */
function stringToArray(rawText) {

  let lines = rawText.trim()
    .replace(/^(\s*?#.*$)/gm, '')
    .trim();

  if (!lines) {
    return [];
  }

  return lines
    .split('\n')
    .filter(value => value !== '');

}

/**
 * contract
 * @param {array} array of phrases and/or words
 * @return {string}
 *   if there are no words and all phrases, phrases are expanded.
 *   If there are no phrases, words are returned as comma separated.
 *   If there is at least one word, the first word is used before fat arrow
 *   and rest of words and phrases are joined
 */
function contract(stringArray) {

  let words = [];
  let phrases = [];
  let result = '';

  stringArray
    .forEach(element => {
      element = element.trim();
      element.match(/\s/) ? phrases.push(element) : words.push(element);
    });

  //if all words, just return joined string
  if (phrases.length === 0) {
    return words.join(',');
  }

  //if all phrases, a a, b b, c c => a a, b b, c c
  if (words.length === 0) {
    return expand(phrases);
  }

  //otherwise, take first word, add arrow, and list
  result += words.concat(phrases).join(',');
  result += ' => ' + words[0];

  return result;
}

/**
 * stringify takes an array or object and joins each element with a comma
 * @param rawObject {object or array}
 * @returns {string} comma delimited string with new lines
 */
function stringify(rawObject) {

  if (Array.isArray(rawObject)) {
    return rawObject.join(',').trim();
  } else {
    return Object
      .keys(rawObject)
      .map((key) => rawObject[key].join(','))
      .join('\n')
      .trim();
  }

}

/**
 * expand function takes raw text and uses => to expand all
 * @param rawText {string} comma delimited string, containing new lines
 * @return {string} replaces lines containing phrases with fat arrows
 */
function expand(elementArray) {
  return elementArray.join(',') + ' => ' + elementArray.join(',');
}

/**
 * expandString function takes string containing white space and replaces with commas
 * @param string {string} single words separated with whitespace
 * @return {string} replaces spaces with commas
 */
function expandString(string) {
  return string.trim().replace(/\s+/g, ',');
}

/**
 * genre function takes an object and processes hierarchically:
 *
 * {
 *   pet: {
 *     cat: {
 *       kitten: 'kitten'
 *     },
 *     dog: {
 *       puppy: 'puppy'
 *     }
 *   }
 *  }
 *
 * Returns:
 *
 * cat => cat,pet
 * kitten => kitten,cat,pet
 * dog => dog,pet
 * puppy => puppy,dog,pet
 *
 * @param {object} representing the hierarchy
 * @return {string} string with lines separated with new line
 */
function genre(genreObject) {

  //only process an actuall objec with keys
  if (!(typeof genreObject === 'object') ||
    Object.keys(genreObject).length === 0) {
    throw new Error('You must pass a valid object');
  }

  //there must only be 1 common ancestor, ignore others
  const ancestor = Object.keys(genreObject)[0];

  //recursive function
  let processChildren = (parent, obj) => {

    let result = [];

    if (typeof obj === 'string') {
      return obj;
    }

    Object.keys(obj)
      .forEach(child => {
        //store top level parent and ancestor
        result.push([child, parent]);
        if (typeof obj[child] !== 'string') {
          processChildren(child, obj[child])
            .forEach(item => result.push(item.concat(parent)));
        }
      });

    return result;

  };

  //process the resultant array, formatting with fat arrow and new lines
  return processChildren(ancestor, genreObject[ancestor])
    .map(item => item[0] + ' => ' + item.join(','))
    .join('\n');

}

module.exports = {
  stringToArray,
  contract,
  stringify,
  expand,
  expandString,
  genre,
};
