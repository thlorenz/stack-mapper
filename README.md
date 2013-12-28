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

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="stackMapper"><span class="type-signature"></span>stackMapper<span class="signature">(sourcemap)</span><span class="type-signature"> &rarr; {StackMapper}</span></h4>
</dt>
<dd>
<div class="description">
<p>Returns a Stackmapper that will use the given source map to map error trace locations.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>sourcemap</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>source map for the generated file</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/stack-mapper/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/stack-mapper/blob/master/index.js#L8">lineno 8</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>stack mapper for the particular source map</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">StackMapper</span>
</dd>
</dl>
</dd>
</dl>
<dt>
<h4 class="name" id="map"><span class="type-signature"></span>map<span class="signature">(stack, <span class="optional">includeSource</span>)</span><span class="type-signature"> &rarr; {string}</span></h4>
</dt>
<dd>
<div class="description">
<p>Maps the trace statements of the given error stack and replaces locations
referencing code in the generated file with the locations inside the original files.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>stack</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>the stack of the Error object</p></td>
</tr>
<tr>
<td class="name"><code>includeSource</code></td>
<td class="type">
<span class="param-type">boolean</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>if set to true, the source code at the first traced location is included</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/stack-mapper/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/stack-mapper/blob/master/index.js#L88">lineno 88</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the error stack with adapted locations</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">string</span>
</dd>
</dl>
</dd>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT
