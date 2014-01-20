'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , fromStr = require('./util/frames-fromstr')
  , v8ToSm = require('./util/frames-v8tosm')

test('\nthree files returning, one with assert exception', function (t) {
  var res = bundleNmap('threefiles-assert', function (err, res) {
    if (err) return console.error(err);

    res.map.file = 'full/path/to/bundle.js';

    var sm = stackMapper(res.map);
    var error;
    try {
      res.main();
    } catch (e) {
      error = e;
    }

    var frames = v8ToSm(error);
    var actual = sm.map(frames).slice(0, 4);

    var expected = fromStr([
      __dirname + '/threefiles-assert/foobar.js:6:3',
      __dirname + '/threefiles-assert/barbar.js:6:10',
      __dirname + '/threefiles-assert/main.js:8:12',
      __dirname + '/threefiles-assert/main.js:10:10',
    ]);

    t.deepEqual(actual, expected);
    t.end()
  })
})
