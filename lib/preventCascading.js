'use strict';

function preventCascading(classBody, isDynamic) {
  for (var parameter in classBody) {
    var value = classBody[parameter];
    if (typeof value === 'object') {
      if (parameter.indexOf(':') === 0 && isDynamic) {
        console.error('Dynamic styles do not support pseudo classes.');
        delete classBody[parameter];
      }
      else if (parameter.indexOf(':') !== 0) {
        console.error('React Style does not support cascading - property ' +
            parameter + ' is removed');
        delete classBody[parameter];
      }

    }
  }
}

module.exports = preventCascading;
