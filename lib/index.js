var React = require('react');
var merge = require('react/lib/merge');
var mergeInto = require('react/lib/mergeInto');
var toArray = require('react/lib/toArray');

var prefixCSS = require('./prefixCSS');
var preventCascading = require('./preventCascading');

var functionName = require('./functionName');
var isArray = Array.isArray;

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

/**
 * Monkey-patch React.DOM.* to handle `styles` prop.
 *
 *  styles="className"
 *  styles={{backgroundColor: 'red'}}
 *  styles=["className", {backgroundColor: 'red'}]
 *
 */
Object.keys(React.DOM).forEach(function(tagName) {
  var factory = React.DOM[tagName];
  React.DOM[tagName] = function(props) {
    if (props && props.styles) {
      var styles = props.styles;

      var updatedProps = merge({}, props);
      delete updatedProps.styles;

      if (isString(styles)) {
        if (updatedProps.className) {
          updatedProps.className += ' ' + styles;
        }
        else {
          updatedProps.className = styles;
        }
      }
      else if (isArray(styles)) {
        var style = {};
        var className = '';

        for (var i = 0, len = styles.length; i < len; i++) {
          var item = styles[i];
          if (isString(item)) {
            className += ' ' + item;
          }
          else if (item === false || item === null || item === undefined) {
            // do nothing
          }
          else {
            mergeInto(style, item);
          }
        }

        if (updatedProps.className) {
          updatedProps.className += ' ' + className;
        }
        else {
          updatedProps.className = className;
        }

        if (updatedProps.style) {
          updatedProps.style = merge(updatedProps.style, style);
        }
        else {
          updatedProps.style = style;
        }
      }

      var args = toArray(arguments);
      args[0] = updatedProps;
      return factory.apply(factory, args);
    }

    return factory.apply(factory, arguments);
  };
});

/**
 * Used as a marker for transformation.
 */
function ReactStyle(func) {

  return function(stopRecursion) {
    var result = func.call(this, arguments);
    var owner = this._owner;
    if (owner) {
      var themes = owner.themes;
      while (owner && !owner.themes) {
        owner = owner._owner;
        if (owner.themes) {
          themes = owner.themes;
        }
      }
    }

    if (themes && !stopRecursion) {
      for (var i = 0, l = themes.length; i < l; i++) {
        var theme = themes[i];
        var componentThemer = theme[this.constructor.displayName];
        if (componentThemer) {
          var styleThemer = componentThemer[functionName(func)];
          if (styleThemer) {
            result += ' ' + styleThemer.call(this, true);
          }
        }
      }
    }

    if (typeof result === 'object') {
      preventCascading(result, true);
      result = prefixCSS(result);
    }

    return result;
  };
}

module.exports = ReactStyle;
