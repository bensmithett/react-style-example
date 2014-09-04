'use strict';

var makeCSSBuilder = require('css-builder');
var preventCascading = require('./preventCascading');

/**
 * Converts the given JSON to valid CSS
 *
 * @param {{}} cssJSON
 * @return {string}
 */
function compileStylesToCSS(cssJSON) {
  var classNames = Object.keys(cssJSON);
  var css = makeCSSBuilder();

  for (var i = 0, l = classNames.length; i < l; i++) {
    var className = classNames[i];
    var classDefinition = cssJSON[className];
    var pseudo = classDefinition.pseudo;
    var classBody = classDefinition.classBody;

    preventCascading(classBody);

    if (classBody) {
      css.rule('.' + className + (pseudo ? (':' + pseudo) : ''), classBody);
    }
  }

  return css.toString();
}

module.exports = compileStylesToCSS;
