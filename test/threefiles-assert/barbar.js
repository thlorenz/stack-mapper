'use strict';

var foobar = require('./foobar');

var go = module.exports = function () {
  return foobar();  
};
