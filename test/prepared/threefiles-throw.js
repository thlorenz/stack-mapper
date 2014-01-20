'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../../')
  , fromStr = require('../util/frames-fromstr')

var origStack = [
  '/full/path/to/bundle.js:14:9',
  '/full/path/to/bundle.js:7:10',
  '/full/path/to/bundle.js:25:12',
  '/full/path/to/bundle.js:27:10',
  '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw.js:20:11',
  '/Users/thlorenz/dev/js/projects/stack-mapper/test/util/bundle-n-map.js:19:7',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:268:46',
  '/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/node_modules/concat-stream/index.js:42:21'
]

var map = { version: 3,
  file: '/path/to/bundle.js',
  sources:
   [ '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/barbar.js',
     '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/foobar.js',
     '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/main.js' ],
  names: [],
  mappings: ';AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;;ACPA;AACA;AACA;AACA;AACA;AACA;;ACLA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA',
  sourcesContent:
   [ '\'use strict\';\n\nvar foobar = require(\'./foobar\');\n\nvar go = module.exports = function () {\n  return foobar();  \n};\n',
     '\'use strict\';\n\nvar go = module.exports = function foobar() {\n  throw new Error(\'shouldn\\\'t have called foobar ;)\');  \n};\n',
     '\'use strict\';\n\nvar barbar = require(\'./barbar\');\n\nmodule.exports = function main() {\n  var a = 1;\n  function bar() {\n    return barbar();\n  }\n  return bar();\n}\n' ] }

test('three files returning, one throwing an error no source', function (t) {
  var sm = stackMapper(map);
  var actual = sm.map(fromStr(origStack));

  actual = actual.slice(0, 5);

  var expected = fromStr([
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/foobar.js:4:9',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/barbar.js:6:10',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/main.js:8:12',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/main.js:10:10',
    '/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw.js:20:11'
  ]);

  t.deepEqual(actual, expected);
  t.end()
})
