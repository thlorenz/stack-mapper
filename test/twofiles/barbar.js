'use strict';

function foobar() {
  return new Error();
}

var go = module.exports = function () {
  return foobar();  
};
