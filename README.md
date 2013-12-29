# stack-mapper [![build status](https://secure.travis-ci.org/thlorenz/stack-mapper.png)](http://travis-ci.org/thlorenz/stack-mapper)

[![testling badge](https://ci.testling.com/thlorenz/stack-mapper.png)](https://ci.testling.com/thlorenz/stack-mapper)

Initialize it with a source map, then feed it error stacks to have the trace locations mapped to the original files.

```js
var stackMapper = require('stack-mapper');

// it is up to you to create stack-mapper compatible frame objects
// this will depend on your environment
var inframes = [{
  filename: '/full/path/to/bundle.js',
  line: 5,
  column: 10
}, {
  filename: '/full/path/to/bundle.js',
  line: 9,
  column: 10
}, {
  filename: '/full/path/to/bundle.js',
  line: 20,
  column: 12
}, {
  filename: '/full/path/to/bundle.js',
  line: 22,
  column: 10,
}, {
  filename: '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles.js',
  line: 18,
  column: 21
}];

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

var sm = stackMapper(map);
var frames = sm.map(inframes);

console.log(frames);
```

#### Output

```
[{
    filename: '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js',
    line: 4,
    column: 10
}, {
    filename: '/Users/thlorenz/dev/js/projects/stack-mapper/test/twofiles/barbar.js',
    line: 8,
    column: 10
}, {
 ...
}]
```

## Obtaining the source map

You need to pass the source map as an object as shown in the example. If your source map happens to be in a different
format, please use the [convert-source-map](https://github.com/thlorenz/convert-source-map) module in order to convert it.

[browserify](https://github.com/substack/node-browserify) attaches source maps to the bottom of the bundle if the `--debug` flag is set, here is an example how to
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

### stackMapper.map(frames, includeSource)

```
/**
 * Maps the trace statements of the given error stack and replaces locations
 * referencing code in the generated file with the locations inside the original files.
 * 
 * @name map
 * @function
 * @param {Array} array of callsite objects (see readme for details about Callsite object)
 * @param {boolean} includeSource if set to true, the source code at the first traced location is included
 * @return {Array.<Object>} info about the error stack with adapted locations, each with the following properties
 *    - filename: original filename 
 *    - line: origial line in that filename of the trace
 *    - column: origial column on that line of the trace
 */
```

## Stack Frames

The frames array passed to stackMapper.map should contain at least the following items

* filename
* line
* column

## License

MIT
