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
  '    at bar (/full/path/to/bundle.js:7:12)',
  '    at Object.main (/full/path/to/bundle.js:9:10)',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/onefile.js:18:21',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/util/bundle-n-map.js:19:7',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:232:22',
  '    at ConcatStream.cb (/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/index.js:268:46)',
  '    at ConcatStream.end (/Users/thlorenz/dev/js/projects/stack-mapper/node_modules/browserify/node_modules/concat-stream/index.js:42:21)',
  '    at Stream.onend (stream.js:79:10)',
  '    at Stream.EventEmitter.emit (events.js:117:20)' ]
  .join('\n')

var map = { 
  version: 3,
  file: 'generated.js',
  sources: [ '/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile/main.js' ],
  names: [],
  mappings: ';AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA',
  sourcesContent: [ '\'use strict\';\n\nmodule.exports = function main() {\n  var a = 1;\n  function bar() {\n    return new Error();\n  }\n  return bar();\n}\n' ] }


test('\none file returning error no sources', function (t) {
  var sm = stackMapper(map);
  var info = sm.map(origStack);
  var stack = relevant(info, 4);

  inspect(stack);
  t.deepEqual(
      stack
    , [ 'Error',
        '    at bar (/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile/main.js:6:12)',
        '    at Object.main (/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile/main.js:8:10)',
        '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/onefile.js' ]
    , 'returns stack with all trace information mapped'
  )

  t.end()
})

test('\none file returning error including sources', function (t) {
  var sm = stackMapper(map);
  var info = sm.map(origStack, true);
  var stack = relevant(info, 5);

  inspect(stack);
  t.deepEqual(
      stack
    , [ 'Error',
        '    at bar (/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile/main.js:6:12)',
        '\t"    return new Error();"',
        '    at Object.main (/Users/thlorenz/dev/js/projects/stack-mapper/test/onefile/main.js:8:10)',
        '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/onefile.js' ]
    , 'returns stack with all trace information mapped'
  )
  t.end()
})
