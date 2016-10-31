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
 * fromArray
 * @param {array} array of phrases and/or words
 * @return {string}
 *   if there are no words and all phrases, phrases are expanded.
 *   If there are no phrases, words are returned as comma separated.
 *   If there is at least one word, the first word is used before fat arrow
 *   and rest of words and phrases are joined
 */
function fromArray(stringArray) {

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

module.exports = {
  stringToArray,
  fromArray,
  stringify,
  expand,
};
