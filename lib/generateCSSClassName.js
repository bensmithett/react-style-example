'use strict';

var currCSSKey = 0;
var uniqueKeys = {};
var allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Get an unique CSS key for the className in a file. It supports up
 * to 140608 classNames.
 *
 * @param {string} fileName
 * @param {string} className
 * @return {*}
 */
function generateCSSClassName(fileName, className) {
  console.assert(arguments.length === 2, 'Function \'generateCSSClassName\' ' +
      'expects 2 arguments - (fileName, className)');
  console.assert(typeof fileName === 'string',
      'fileName is expected to be a string');
  console.assert(typeof className === 'string',
      'className is expected to be a string');

  if (uniqueKeys[fileName + className]) {
    return uniqueKeys[fileName + className];
  }

  var allowedCharactersLength = allowedCharacters.length;
  var key1unit = allowedCharactersLength * allowedCharactersLength;
  var key1pos = Math.floor(currCSSKey / key1unit);
  var key1 = allowedCharacters[key1pos - 1];
  var key2pos = Math.floor((currCSSKey -
      (key1 ? key1pos * key1unit : 0)) / allowedCharactersLength);
  var key2 = allowedCharacters[key2pos - 1];
  var key3 = allowedCharacters[(currCSSKey -
      (key1 ? (key1pos * key1unit) : 0) -
      (key2 ? key2pos * allowedCharactersLength : 0))];
  var key = '';
  if (key1) {
    key += key1;
  }
  if (key2) {
    key += key2;
  }
  if (key3) {
    key += key3;
  }
  currCSSKey++;

  uniqueKeys[fileName + className] = key;
  return key;
}

module.exports = generateCSSClassName;
