'use strict';

var SourceMapConsumer = require('source-map-cjs/lib/source-map/source-map-consumer').SourceMapConsumer
  , shims = require('./shims')

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
 */
function setupConsumer(sourcemap) {

  shims.define();

  var consumer = new SourceMapConsumer(sourcemap)
  var sources = sourcemap.sources;

  function originalPosition(line, column) {
    return consumer.originalPositionFor({ source: sourcemap.file, line: line, column: column });
  }

  shims.undefine();
  return {
      originalPosition: originalPosition
  };
}
