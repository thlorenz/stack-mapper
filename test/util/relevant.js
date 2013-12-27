'use strict';

var go = module.exports = function (err, nlines) {

  var relevant = err.stack.split('\n').slice(0, nlines);

  // remove location from last trace which points to our test file
  // that location will change all the time, so we don't want it
  var last = relevant.pop();
  relevant.push(last.split(':')[0]);
  return relevant;  
};
