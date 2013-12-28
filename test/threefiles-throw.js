'use strict';
/*jshint asi: true */

var test = require('tap').test
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , relevant = require('./util/relevant')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nthree files returning, one throwing an error no source', function (t) {
  var res = bundleNmap('threefiles-throw', function (err, res) {
    if (err) return console.error(err);
     
    var sm = stackMapper(res.map);
    var error;
    try { 
      res.main(); 
    } catch (e) { 
      error = e; 
    }

    var info = sm.map(error.stack);
    var stack = relevant(info, 6);

    inspect(stack);
    t.deepEqual(
        stack
      , [ 'Error: shouldn\'t have called foobar ;)',
        '    at foobar (' + __dirname + '/threefiles-throw/foobar.js:4:9)',
        '    at module.exports (' + __dirname + '/threefiles-throw/barbar.js:6:10)',
        '    at bar (' + __dirname + '/threefiles-throw/main.js:8:12)',
        '    at Object.main (' + __dirname + '/threefiles-throw/main.js:10:10)',
        '    at ' + __dirname + '/threefiles-throw.js' ]
      , 'returns stack with all trace information mapped'
    )

    t.end()
  })
})

test('\nthree files returning, one throwing an error including source', function (t) {
  var res = bundleNmap('threefiles-throw', function (err, res) {
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
      , [ 'Error: shouldn\'t have called foobar ;)',
        '    at foobar (/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/foobar.js:4:9)',
        '\t"  throw new Error(\'shouldn\\\'t have called foobar ;)\');  "',
        '    at module.exports (/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/barbar.js:6:10)',
        '    at bar (/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/main.js:8:12)',
        '    at Object.main (/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/main.js:10:10)',
        '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw.js' ]
      , 'returns stack with all trace information mapped'
    )

    t.end()
  })
})
