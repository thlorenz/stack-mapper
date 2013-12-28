'use strict';

var barbar = require('./barbar');

module.exports = function main() {
  var a = 1;
  function bar() {
    return barbar();
  }
  return bar();
}
