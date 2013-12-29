'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , fromStr = require('./util/frames').fromStr
  , v8ToSm = require('./util/frames').v8ToSm


test('\none file returning error', function (t) {
  var res = bundleNmap('onefile', function (err, res) {
    if (err) return console.error(err);

    var sm = stackMapper(res.map);
    var error = res.main();
    var frames = v8ToSm(error);

    var actual = sm.map(frames).slice(0, 3);

    var expected = fromStr([
        __dirname + '/onefile/main.js:6:12',
        __dirname + '/onefile/main.js:8:10',
        __dirname + '/onefile.js:16:21'
    ]);

    t.deepEqual(actual, expected);
    t.end()
  })
})
