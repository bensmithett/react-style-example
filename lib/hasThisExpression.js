'use strict';

var recast = require('recast');

function hasThisExpression(ast) {
  var isDynamic = false;
  recast.visit(ast, {
    visitThisExpression: function(node) {
      isDynamic = true;
      this.traverse(node);
    }
  });
  return isDynamic;
}

module.exports = hasThisExpression;
