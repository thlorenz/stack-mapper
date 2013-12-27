'use strict';

module.exports = function main() {
  var a = 1;
  function bar() {
    return new Error();
  }
  return bar();
}
