'use strict';
/*jshint asi: true */

var test = require('tape')
  , stackMapper = require('../../')
  , relevant = require('../util/relevant')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

var origStack = [ 
  'Error',
  '    at foobar (/full/path/to/bundle.js:5:10)',
  '    at module.exports (/full/path/to/bundle.js:9:10)',
  '    at bar (/full/path/to/bundle.js:20:12)',
  '    at Object.main (/full/path/to/bundle.js:22:10)',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles.js:18:21',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/util/bundle-n-map.js:19:7',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '    at ConcatStream.cb (/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:268:46)',
  '    at ConcatStream.end (/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/node_modules/concat-stream/index.js:42:21)' ]
  .join('\n')

var map = { version: 3,
  file: 'generated.js',
  sources:
   [ '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js',
     '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js' ],
  names: [],
  mappings: ';AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;;ACTA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA',
  sourcesContent:
   [ '\'use strict\';\n\nfunction foobar() {\n  return new Error();\n}\n\nvar go = module.exports = function () {\n  return foobar();  \n};\n',
     '\'use strict\';\n\nvar barbar = require(\'./barbar\');\n\nmodule.exports = function main() {\n  var a = 1;\n  function bar() {\n    return barbar();\n  }\n  return bar();\n}\n' ] }

test('\ntwo files returning error no sources', function (t) {
  var sm = stackMapper(map);
  var info = sm.map(origStack);
  var stack = relevant(info, 6);

  inspect(stack);
  t.deepEqual(
      stack
    , [ 'Error',
      '    at foobar (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js:4:10)',
      '    at module.exports (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js:8:10)',
      '    at bar (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js:8:12)',
      '    at Object.main (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js:10:10)',
      '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles.js' ]
    , 'returns stack with all trace information mapped'
  )

  t.end()
})

test('\ntwo files returning error including sources', function (t) {
  var sm = stackMapper(map);
  var info = sm.map(origStack, true);
  var stack = relevant(info, 7);

  inspect(stack);
  t.deepEqual(
      stack
    , [ 'Error',
        '    at foobar (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js:4:10)',
        '\t"  return new Error();"',
        '    at module.exports (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js:8:10)',
        '    at bar (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js:8:12)',
        '    at Object.main (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js:10:10)',
        '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles.js' ]
          , 'returns stack with all trace information mapped'
  )
  t.end()
})
