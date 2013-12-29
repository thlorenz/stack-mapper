'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../')
  , bundleNmap = require('./util/bundle-n-map')
  , fromStr = require('./util/frames').fromStr
  , v8ToSm = require('./util/frames').v8ToSm

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('two files returning error no source', function (t) {
  var res = bundleNmap('twofiles', function (err, res) {
    if (err) return console.error(err);
     
    var sm = stackMapper(res.map);
    var error = res.main();
    var frames = v8ToSm(error);
    var actual = sm.map(frames).slice(0, 5);

    var expected = fromStr([
          __dirname + '/twofiles/barbar.js:4:10',
          __dirname + '/twofiles/barbar.js:8:10',
          __dirname + '/twofiles/main.js:8:12',
          __dirname + '/twofiles/main.js:10:10',
          __dirname + '/twofiles.js:19:21'
    ]);

    t.deepEqual(actual, expected);
    t.end()
  })
})
