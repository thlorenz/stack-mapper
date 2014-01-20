'use strict';

var setupConsumer = require('./lib/setup-consumer')
  , shims = require('./lib/shims')

module.exports = 

/**
 * Returns a Stackmapper that will use the given source map to map error trace locations.
 * 
 * @name stackMapper
 * @function
 * @param {Object} sourcemap source map for the generated file
 * @return {StackMapper} stack mapper for the particular source map
 */
function stackMapper(sourcemap) { return new StackMapper(sourcemap); }
var proto = StackMapper.prototype;

function filter(arr, fn) {
  var matches = [];
  for (var i = 0; i < arr.length; i++) {
    if (fn(arr[i])) matches.push(arr[i]);
  }
  return matches;
}

/**
 * Creates a Stackmapper that will use the given source map to map error trace locations
 * 
 * @name StackMapper
 * @private
 * @constructor
 * @param {Object} sourcemap 
 */
function StackMapper(sourcemap) {
  if (!(this instanceof StackMapper)) return new StackMapper(sourcemap);
  if (typeof sourcemap !== 'object') 
    throw new Error('sourcemap needs to be an object, please use convert-source-map module to convert it from any other format\n' +
                    'See: https://github.com/thlorenz/stack-mapper#obtaining-the-source-map');

  this._sourcemap = sourcemap;
  this._prepared = false;
}

proto._prepare = function () {
  var prepped = setupConsumer(this._sourcemap);
  this._originalPosition = prepped.originalPosition;
  this._prepared = true;
}

proto._mapStack = function (stack) {
  var self = this;

  var generatedFile = self._sourcemap.file;
  var re = new RegExp(generatedFile + '$');

  for (var i = 0; i < stack.length; i++) {
    var frame = stack[i];

    if (!re.test(frame.filename)) {
      continue;
    }

    var orig = self._originalPosition(frame.line, frame.column);
    frame.filename = orig.source;
    frame.line = orig.line;

    // In case that the sourcemap was generated for a javascript file, the column numbers might not have been added
    // In that case it makes sense to assume that it is the same as the generated column number
    if (!(orig.source.slice(-3) === '.js' && orig.column === 0 && frame.column > 0)) {
      frame.column = orig.column;
    }
  }
}

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
proto.map = function (stack) {

  shims.define();

  // do work at latest point possible and only once
  if (!this._prepared) this._prepare();

  // clone to leave original intact
  var adapted = [].concat(stack);

  // replace stack entries with mapped entires to original
  this._mapStack(adapted);

  shims.undefine();

  return adapted;
}
