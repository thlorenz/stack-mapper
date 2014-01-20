'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , fromStr = require('./util/frames-fromstr')
  , v8ToSm = require('./util/frames-v8tosm')


test('\none file returning error', function (t) {
  var res = bundleNmap('onefile', function (err, res) {
    if (err) return console.error(err);

    res.map.file = 'full/path/to/bundle.js';

    var sm = stackMapper(res.map);
    var error = res.main();
    var frames = v8ToSm(error);

    var actual = sm.map(frames).slice(0, 2);

    var expected = fromStr([
        __dirname + '/onefile/main.js:6:12',
        __dirname + '/onefile/main.js:8:10',
    ]);

    t.deepEqual(actual, expected);
    t.end()
  })
})
