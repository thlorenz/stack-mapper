'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , relevant = require('./util/relevant')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\ntwo files returning error no source', function (t) {
  var res = bundleNmap('twofiles', function (err, res) {
    if (err) return console.error(err);
     
    var sm = stackMapper(res.map);
    var error = res.main();
    var info = sm.map(error.stack);
    var stack = relevant(info, 6);

    inspect(stack);
    t.deepEqual(
        stack
      , [ 'Error',
          '    at foobar (' + __dirname + '/twofiles/barbar.js:4:10)',
          '    at module.exports (' + __dirname + '/twofiles/barbar.js:8:10)',
          '    at bar (' + __dirname + '/twofiles/main.js:8:12)',
          '    at Object.main (' + __dirname + '/twofiles/main.js:10:10)',
          '    at ' + __dirname + '/twofiles.js' ]
      , 'returns stack with all trace information mapped'
    )

    t.end()
  })
})

test('\ntwo files returning error including source', function (t) {
  var res = bundleNmap('twofiles', function (err, res) {
    if (err) return console.error(err);
     
    var sm = stackMapper(res.map);
    var error = res.main();
    var info = sm.map(error.stack, true);
    var stack = relevant(info, 7);

    inspect(stack);
    t.deepEqual(
        stack
      , [ 'Error',
          '    at foobar (' + __dirname + '/twofiles/barbar.js:4:10)',
          '\t"  return new Error();"',
          '    at module.exports (' + __dirname + '/twofiles/barbar.js:8:10)',
          '    at bar (' + __dirname + '/twofiles/main.js:8:12)',
          '    at Object.main (' + __dirname + '/twofiles/main.js:10:10)',
          '    at ' + __dirname + '/twofiles.js' ]
      , 'returns stack with all trace information mapped'
    )

    t.end()
  })
})

