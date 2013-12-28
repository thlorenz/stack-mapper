
'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../../')
  , relevant = require('../util/relevant')

var origStack = [ 
  'Error: shouldn\'t have called foobar ;)',
  '    at foobar (/full/path/to/bundle.js:14:9)',
  '    at module.exports (/full/path/to/bundle.js:7:10)',
  '    at bar (/full/path/to/bundle.js:25:12)',
  '    at Object.main (/full/path/to/bundle.js:27:10)',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw.js:20:11',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/util/bundle-n-map.js:19:7',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '    at ConcatStream.cb (/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:268:46)',
  '    at ConcatStream.end (/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/node_modules/concat-stream/index.js:42:21)' ]
  .join('\n')

var map = { version: 3,
  file: 'generated.js',
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

test('\nthree files returning, one throwing an error no source', function (t) {
  var sm = stackMapper(map);
  var info = sm.map(origStack);
  var stack = relevant(info, 6);

  t.deepEqual(
      stack
    , [ 'Error: shouldn\'t have called foobar ;)',
        '    at foobar (/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/foobar.js:4:9)',
        '    at module.exports (/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/barbar.js:6:10)',
        '    at bar (/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/main.js:8:12)',
        '    at Object.main (/Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw/main.js:10:10)',
        '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/threefiles-throw.js' ]
    , 'returns stack with all trace information mapped'
  )

  t.end()
})

test('\nthree files returning, one throwing an error including source', function (t) {
  var sm = stackMapper(map);
  var info = sm.map(origStack, true);
  var stack = relevant(info, 7);

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
