function functionName(fn) {
  if (fn.name) {
    return fn.name;
  }

  return fn.toString().match(/^function\s*([^\s(]+)/)[1];
}

module.exports = functionName;
