'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , fromStr = require('./util/frames').fromStr
  , v8ToSm = require('./util/frames').v8ToSm

test('\nthree files returning, one with assert exception', function (t) {
  var res = bundleNmap('threefiles-assert', function (err, res) {
    if (err) return console.error(err);
     
    var sm = stackMapper(res.map);
    var error;
    try { 
      res.main(); 
    } catch (e) { 
      error = e; 
    }

    var frames = v8ToSm(error);
    var actual = sm.map(frames).slice(0, 5);

    var expected = fromStr([
      __dirname + '/threefiles-assert/foobar.js:6:3',
      __dirname + '/threefiles-assert/barbar.js:6:10',
      __dirname + '/threefiles-assert/main.js:8:12',
      __dirname + '/threefiles-assert/main.js:10:10',
      __dirname + '/threefiles-assert.js:17:11'
    ]);

    t.deepEqual(actual, expected);
    t.end()
  })
})
