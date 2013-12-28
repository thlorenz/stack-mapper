'use strict';

var stackMapper = require('../');

var origStack = [ 
  'Error',
  '    at foobar (/full/path/to/bundle.js:5:10)',
  '    at module.exports (/full/path/to/bundle.js:9:10)',
  '    at bar (/full/path/to/bundle.js:20:12)',
  '    at Object.main (/full/path/to/bundle.js:22:10)',
  '    at /Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles.js:18:21' ]
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

var includeSource = true;
var sm = stackMapper(map);
var info = sm.map(origStack, includeSource);

console.log(info.stack);
