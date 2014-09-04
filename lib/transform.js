'use strict';

var path              = require('path');
var vm                = require('vm');
var freeVariables     = require('free-variables');
var recast            = require('recast');
var addCSSClass       = require('./addCSSClass');
var hasThisExpression = require('./hasThisExpression');

var b = recast.types.builders;

/**
 * @param {String} contents
 * @param {String} filename
 */
function transform(ast, filename, options) {
  var requires = {};
  var styles = {};

  recast.visit(ast, {

    // Find all `var <id> = require(<module>)` so we can provide them for
    // style generation if needed.
    //
    // It is not correct 100% of times (some edge cases are missing) but
    // with es6 import declarations this task would be much simpler.
    visitCallExpression: function(node) {
      if (this.isModuleRequire(node)) {
        var parentValue = node.parentPath.value;
        requires[parentValue.id.name] = {
          ast: node.value,
          path: node,
          counter: 0
        };
      }
      this.traverse(node);
    },

    visitObjectExpression: function(node) {
      return b.objectExpression(node.value.properties.map(function(property) {
        if (!this.isStyleDeclaration(property)) {
          return property;
        }
        var styleName = property.key.name;
        var cssAST = property.value.arguments[0].body;

        if (hasThisExpression(cssAST)) {
          return property;
        } else {
          return b.property('init',
            b.identifier(styleName),
            this.evaluateStyle(styleName, cssAST));
        }
      }, this));
    },

    isModuleRequire: function(node) {
      var callee = node.value.callee;
      var parentValue = node.parentPath.value;
      return (
        callee.type === 'Identifier'
        && callee.name === 'require'
        && parentValue.type === 'VariableDeclarator'
        && parentValue.id.type === 'Identifier'
      );
    },

    isStyleDeclaration: function(property) {
      return (
        property.value.type === 'CallExpression'
        && property.value.callee.type === 'Identifier'
        && property.value.callee.name === 'ReactStyle'
      );
    },

    evaluateStyle: function(styleName, ast) {
      var src = recast.print(ast).code;

      var freeVars = freeVariables(ast);
      if (freeVars.length > 0) {
        freeVars.forEach(function(variable) {
          if (requires[variable]) {
            src = (
              'var ' + variable + ' = '
              + recast.print(requires[variable].ast).code + '\n'
              + src
            );
          }
        });
      }
      src = 'var __result__ = (function() {' + src + '})();';
      var sandbox = {
        require: function(mod) {
          var dirname = path.relative(__dirname, path.dirname(filename));
          return require(path.join(dirname, mod));
        }
      };
      vm.runInNewContext(src, sandbox, __filename);
      var cssCode = sandbox.__result__;
      var className = addCSSClass(
        styles,
        filename,
        styleName,
        cssCode,
        options
      );

      return b.callExpression(b.identifier('ReactStyle'), [b.functionExpression(b.identifier(styleName), [],
        b.blockStatement([b.returnStatement(b.literal(className))]))]);
    }
  });

  return {ast: ast, styles: styles};
}

module.exports = transform;
