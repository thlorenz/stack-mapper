'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../../')
  , fromStr = require('../util/frames-fromstr')

var origStack = [
  '/full/path/to/bundle.js:5:10',
  '/full/path/to/bundle.js:9:10',
  '/full/path/to/bundle.js:20:12',
  '/full/path/to/bundle.js:22:10',
  '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles.js:18:21',
  '/Users/thlorenz/dev/js/projects/stack-mapper/test/util/bundle-n-map.js:19:7',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:268:46',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/node_modules/concat-stream/index.js:42:21'
]

var map = { version: 3,
  file: '/path/to/bundle.js',
  sources:
   [ '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js',
     '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js' ],
  names: [],
  mappings: ';AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;;ACTA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA',
  sourcesContent:
   [ '\'use strict\';\n\nfunction foobar() {\n  return new Error();\n}\n\nvar go = module.exports = function () {\n  return foobar();  \n};\n',
     '\'use strict\';\n\nvar barbar = require(\'./barbar\');\n\nmodule.exports = function main() {\n  var a = 1;\n  function bar() {\n    return barbar();\n  }\n  return bar();\n}\n' ] }

test('two files returning error no sources', function (t) {
  var sm = stackMapper(map);
  var actual = sm.map(fromStr(origStack));

  actual = actual.slice(0, 5);

  var expected = fromStr([
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js:4:10',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js:8:10',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js:8:12',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js:10:10',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles.js:18:21'
  ]);

  t.deepEqual(actual, expected);
  t.end()
})
