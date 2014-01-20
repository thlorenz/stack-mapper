'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../../')
  , fromStr = require('../util/frames-fromstr')

var origStack = [
  '/full/path/to/bundle.js:7:12',
  '/full/path/to/bundle.js:9:10',
  '/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile.js:18:21',
  '/Users/thlorenz/dev/js/projects/stack-mapper/test/util/bundle-n-map.js:19:7',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:268:46',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/node_modules/concat-stream/index.js:42:21',
  'stream.js:79:10',
  'events.js:117:20'
]

var map = {
  version: 3,
  file: '/path/to/bundle.js',
  sources: [ '/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile/main.js' ],
  names: [],
  mappings: ';AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA',
  sourcesContent: [ '\'use strict\';\n\nmodule.exports = function main() {\n  var a = 1;\n  function bar() {\n    return new Error();\n  }\n  return bar();\n}\n' ] }

test('one file returning error', function (t) {

  var sm = stackMapper(map);

  var actual = sm.map(fromStr(origStack));

  // cut down on what we care about
  actual = actual.splice(0, 3);

  var expected = fromStr([
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile/main.js:6:12',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile/main.js:8:10',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile.js:18:21'
  ]);

  t.deepEqual(actual, expected);
  t.end();
})
