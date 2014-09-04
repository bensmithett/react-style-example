'use strict';

var prefixes = ['Ms', 'ms', 'Webkit', 'webkit', 'Moz', 'moz'];

var el = document.createElement('div');
var cssPropertyNames = Object.keys(el.style);
var cssPrefixFreePropertyNames = {};
var browserPrefixRegexp = /^Ms|^ms|^Webkit|^webkit|Moz|moz/;
var replaceStr = '(';

// Firefox doesn't play nice with our approach
if (cssPropertyNames.length === 0) {
  for (var key in el.style) {
    cssPropertyNames.push(key);
  }
}
el = null;

for (var i = 0, l = cssPropertyNames.length; i < l; i++) {
  var cssPropertyName = cssPropertyNames[i];
  if (cssPropertyName.search(browserPrefixRegexp) === 0) {
    var prefixFreePropertyName =
        cssPropertyName.replace(browserPrefixRegexp, '');
    prefixFreePropertyName = prefixFreePropertyName[0].toLowerCase() +
        prefixFreePropertyName.substr(1);
    cssPrefixFreePropertyNames[prefixFreePropertyName] = true;
    replaceStr += prefixFreePropertyName + ' |' +
                  prefixFreePropertyName + ',|' +
                  prefixFreePropertyName + '$|';
  }
}

replaceStr = replaceStr.substr(0, replaceStr.length - 1) + ')';

var replaceRegExp = new RegExp(replaceStr);

function hyphenate(name) {
  return name.replace(/[A-Z]/g, function($1) {
    return '-' + $1.toLowerCase();
  });
}

function prefixValue(prefix, value) {
  return value.replace(replaceRegExp, function($1) {
    return '-' + prefix[0].toLowerCase() + prefix.substr(1) + '-' + $1;
  });
}

function prefixCSS(obj) {
  var cssNames = Object.keys(obj);
  for (var i = 0, l = cssNames.length; i < l; i++) {
    var cssName = cssNames[i];
    var value = obj[cssName];
    if (cssPrefixFreePropertyNames[cssName]) {
      delete obj[cssName];
      for (var j = 0, len = prefixes.length; j < len; j++) {
        var prefix = prefixes[j];
        obj[prefix + cssName[0].toUpperCase() + cssName.substr(1)] =
            prefixValue(prefix, value);
      }
      obj[cssName] = value;
    }
  }
  return obj;
}

module.exports = prefixCSS;
