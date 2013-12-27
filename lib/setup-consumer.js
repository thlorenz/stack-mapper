'use strict';

var SourceMapConsumer = require('source-map').SourceMapConsumer

var go = module.exports = 

/**
 * Sets up the sourcemap consumer and hashes sources by file
 * 
 * @name setupConsumer
 * @function
 * @param {Object} sourcemap the mappings from the generated file back to the original files/locations
 * @return {Object} with properties
 *  - {Function(line, column)} originalPosition gets the orignal position for the given generated position
 *  - {Object.<string,string>} filename -> source hash
 */
function setupConsumer(sourcemap) {
  var consumer = new SourceMapConsumer(sourcemap)

  var sourcesByFile = sourcemap.sources.reduce(function (acc, x, idx) {
    acc[x] = sourcemap.sourcesContent[idx] && sourcemap.sourcesContent[idx].split('\n')
    return acc;    
  }, {});

  function originalPosition(line, column) {
    return consumer.originalPositionFor({ source: sourcemap.file, line: line, column: column });
  }

  return {
      originalPosition: originalPosition 
    , sourcesByFile: sourcesByFile
  };
}
