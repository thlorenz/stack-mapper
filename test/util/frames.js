var stackTrace = require('stack-trace');

// turn an array of file:line:col to stack-mapper frames
module.exports.fromStr = function stack_frames(str_arr) {
  var frames = [];
  for (var i=0 ; i<str_arr.length ; ++i) {
    var frame_str = str_arr[i];

    var matched = frame_str.match(/^(.*)[:](\d+)[:](\d+)$/);
    frames.push({
      filename: matched[1],
      line: matched[2] - 0,
      column: matched[3] - 0
    });
  }

  return frames;
};

// convert v8 frames to stack-mapper frames
module.exports.v8ToSm = function v8ToSm(err) {
  var trace = stackTrace.parse(err);
  return trace.map(function(frame) {
    return {
      filename: frame.fileName,
      line: frame.lineNumber,
      column: frame.columnNumber
    }
  });
}

