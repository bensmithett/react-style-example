'use strict';

var loaderUtils = require('loader-utils');
var transformString = require('./transformString');

function loader(source) {
  this.cacheable();

  // fast path
  if (source.indexOf('ReactStyle') === -1) {
    return source;
  }

  var options = loaderUtils.parseQuery(this.query);
  var result = transformString(source, this.resource, options);
  if (result.css.length > 0) {
    this.addText(result.css);
  }
  return result.source;
}

module.exports = loader;
