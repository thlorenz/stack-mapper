'use strict';

var stackTrace = require('stack-trace');

// convert v8 frames to stack-mapper frames
module.exports = function v8ToSm(err) {
  var trace = stackTrace.parse(err);
  return trace.map(function(frame) {
    return {
      filename: frame.fileName,
      line: frame.lineNumber,
      column: frame.columnNumber
    }
  });
}
