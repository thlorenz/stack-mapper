'use strict';

var SourceMapConsumer = require('source-map-cjs/lib/source-map/source-map-consumer').SourceMapConsumer

var go = module.exports = 

/**
 * Sets up the sourcemap consumer and hashes sources by file
 * 
 * @name setupConsumer
 * @private
 * @function
 * @param {Object} sourcemap the mappings from the generated file back to the original files/locations
 * @return {Object} with properties
 *  - {Function(line, column)} originalPosition gets the orignal position for the given generated position
 *  - {Object.<string,string>} filename -> source hash
 */
function setupConsumer(sourcemap) {
  // define shims
  // this stuff's gotta work in IE6,7,8 -- thanks MS
  var Array_isArray = Array.isArray
    , Array_map = Array.map
    , Array_forEach = Array.forEach;

  // isarray only shims if Array.isArray is not present
  Array.isArray = require('isarray');
  if (typeof Array.map !== 'function') Array.map = require('array-map');
  if (typeof Array.forEach !== 'function') Array.forEach = require('foreach-shim');

  var consumer = new SourceMapConsumer(sourcemap)
  var sources = sourcemap.sources;
  var sourcesByFile = {};

  for (var i = 0; i < sources.length; i++) {
    sourcesByFile[sources[i]] = sourcemap.sourcesContent[i] && sourcemap.sourcesContent[i].split('\n')
  }

  function originalPosition(line, column) {
    return consumer.originalPositionFor({ source: sourcemap.file, line: line, column: column });
  }

  // undefine shims
  Array.isArray = Array_isArray;
  Array.map = Array_map;
  Array.forEach = Array_forEach;

  return {
      originalPosition: originalPosition 
    , sourcesByFile: sourcesByFile
  };
}
