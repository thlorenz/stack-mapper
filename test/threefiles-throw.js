'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , fromStr = require('./util/frames-fromstr')
  , v8ToSm = require('./util/frames-v8tosm')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('three files returning, one throwing an error', function (t) {
  var res = bundleNmap('threefiles-throw', function (err, res) {
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
      __dirname + '/threefiles-throw/foobar.js:4:9',
      __dirname + '/threefiles-throw/barbar.js:6:10',
      __dirname + '/threefiles-throw/main.js:8:12',
      __dirname + '/threefiles-throw/main.js:10:10',
    ]);

    t.deepEqual(actual, expected);
    t.end()
  })
})
