# stack-mapper [![build status](https://secure.travis-ci.org/thlorenz/stack-mapper.png)](http://travis-ci.org/thlorenz/stack-mapper)

[![testling badge](https://ci.testling.com/thlorenz/stack-mapper.png)](https://ci.testling.com/thlorenz/stack-mapper)

Initialize it with a source map, then feed it error stacks to have the trace locations mapped to the original files.

```js
var stackMapper = require('stack-mapper');

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
```

#### Output

```
Error
    at foobar (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js:4:10)
      "  return new Error();"
    at module.exports (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js:8:10)
    at bar (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js:8:12)
    at Object.main (/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/main.js:10:10)
    at /Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles.js:18:21
```

## Obtaining the source map

You need to pass the source map as an object as shown in the example. If your source map happens to be in a different
format, pleas use the [convert-source-map]() module in order to convert it.

[browserify]() attaches source maps to the bottom of the bundle if the `--debug` flag is set, here is an example how to
obtain and convert it to use with `stack-mapper`.

```js
var browserify =  require('browserify')
  , convert    =  require('convert-source-map')

browserify()
  .require(entry)
  .bundle({ debug: true }, function (err, src) {
    if (err) return cb(err);

    var map = convert.fromSource(src).toObject();
  });
```

## Installation

    npm install stack-mapper

## API

### stackMapper(sourcemap)

```
/**
 * Returns a Stackmapper that will use the given source map to map error trace locations.
 * 
 * @name stackMapper
 * @function
 * @param {Object} sourcemap source map for the generated file
 * @return {StackMapper} stack mapper for the particular source map
 */
```

### stacMapper.map(stack, includeSource)
```
/**
 * Maps the trace statements of the given error stack and replaces locations
 * referencing code in the generated file with the locations inside the original files.
 * 
 * @name map
 * @function
 * @param {string} stack the stack of the Error object
 * @param {boolean=} includeSource if set to true, the source code at the first traced location is included
 * @return {Object} info about the error stack with adapted locations with the following properties
 *    - stack  stringified stack
 *    - parsed deserialized stack with all original information plus the one added by stack-mapper 
 */
```

## License

MIT
