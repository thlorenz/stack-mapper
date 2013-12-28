'use strict';

var go = module.exports = function foobar() {
  throw new Error('shouldn\'t have called foobar ;)');  
};
