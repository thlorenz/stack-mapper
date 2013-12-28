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
 * @param {String} includeSource when true a sourcesByFile hash is derrived and included in the return value
 * @return {Object} with properties
 *  - {Function(line, column)} originalPosition gets the orignal position for the given generated position
 *  - {Object.<string,string>} filename -> source hash
 */
function setupConsumer(sourcemap, includeSource) {

  shims.define();

  var consumer = new SourceMapConsumer(sourcemap)
  var sources = sourcemap.sources;
  var sourcesByFile = {};


  if (includeSource) {
    for (var i = 0; i < sources.length; i++) {
      sourcesByFile[sources[i]] = sourcemap.sourcesContent[i] && sourcemap.sourcesContent[i].split('\n')
    }
  }

  function originalPosition(line, column) {
    return consumer.originalPositionFor({ source: sourcemap.file, line: line, column: column });
  }


  shims.undefine();
  return {
      originalPosition: originalPosition 
    , sourcesByFile: sourcesByFile
  };
}
