'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , relevant = require('./util/relevant')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\none file returning error no sources', function (t) {
  var res = bundleNmap('onefile', function (err, res) {
    if (err) return console.error(err);
     
    var sm = stackMapper(res.map);
    var error = res.main();

    var info = sm.map(error.stack);
    var stack = relevant(info, 4);

    inspect(stack);
    t.deepEqual(
        stack
      , [ 'Error',
          '    at bar (' + __dirname + '/onefile/main.js:6:12)',
          '    at Object.main (' + __dirname + '/onefile/main.js:8:10)',
          '    at ' + __dirname + '/onefile.js']
      , 'returns stack with all trace information mapped'
    )

    t.end()
  })
})

test('\none file returning error including sources', function (t) {
  var res = bundleNmap('onefile', function (err, res) {
    if (err) return console.error(err);
     
    var sm = stackMapper(res.map);
    var error = res.main();
    var info = sm.map(error.stack, true);
    var stack = relevant(info, 5);

    inspect(stack);
    t.deepEqual(
        stack
      , [ 'Error',
          '    at bar (' + __dirname + '/onefile/main.js:6:12)',
          '\t"    return new Error();"',
          '    at Object.main (' + __dirname + '/onefile/main.js:8:10)',
          '    at ' + __dirname + '/onefile.js']
      , 'returns stack with all trace information mapped and sources for first trace inserted'
    )

    t.end()
  })
})
