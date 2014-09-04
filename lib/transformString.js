'use strict';

var autoprefixer        = require('autoprefixer');
var compileStylesToCSS  = require('./compileStylesToCSS');
var esprima             = require('esprima-fb');
var recast              = require('recast');
var transform           = require('./transform');


function transformString(source, filename, options) {
  options = options || {};
  var ast = recast.parse(source, {esprima: esprima});
  var result = transform(ast, filename, options);
  var css = compileStylesToCSS(result.styles);

  if (options.autoprefixer) {
    css = autoprefixer(options.autoprefixer.browsers).process(css).css;
  }
  return {
    css: css,
    source: recast.print(ast).code
  };
}

module.exports = transformString;
