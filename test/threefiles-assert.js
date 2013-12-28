'use strict';
/*jshint asi: true */

var test = require('tap').test
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , relevant = require('./util/relevant')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nthree files returning, one with assert exception including source', function (t) {
  var res = bundleNmap('threefiles-assert', function (err, res) {
    if (err) return console.error(err);
     
    var sm = stackMapper(res.map);
    var error;
    try { 
      res.main(); 
    } catch (e) { 
      error = e; 
    }

    var info = sm.map(error.stack, true);
    var stack = relevant(info, 7);

    inspect(stack);
    t.deepEqual(
        stack
      , [ 'AssertionError: false == true',
          '    at foobar (' + __dirname + '/threefiles-assert/foobar.js:6:3)',
          '\t"  assert(\'monoliths and frameworks are a good thing\' === true);"',
          '    at module.exports (' + __dirname + '/threefiles-assert/barbar.js:6:10)',
          '    at bar (' + __dirname + '/threefiles-assert/main.js:8:12)',
          '    at Object.main (' + __dirname + '/threefiles-assert/main.js:10:10)',
          '    at ' + __dirname + '/threefiles-assert.js' ]
      , 'returns stack with all trace information mapped'
    )

    t.end()
  })
})
