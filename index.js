'use strict';

var stackTrace = require('stack-trace')
  , setupConsumer = require('./lib/setup-consumer')

module.exports = StackMapper;
var proto = StackMapper.prototype;
  
/**
 * Crops the stack by removing all traces that point originated outside the generated file we mapped
 * 
 * @name cropStack
 * @function
 * @param {Array.<Object>} stack original stack
 * @return {Array.<Object>} cropped stack
 */
function cropStack(stack) {
  if (!stack || !stack.length) return [];
  var generatedFile = stack[0].fileName; 
  return stack.filter(function (x) { return x.fileName === generatedFile });
}

function StackMapper(sourcemap) {
  if (!(this instanceof StackMapper)) return new StackMapper(sourcemap);
  if (typeof sourcemap !== 'object') 
    throw new Error('sourcemap needs to be an object, please use convert-source-map module to convert it from any other format');

  var prepped = setupConsumer(sourcemap);
  this._originalPosition = prepped.originalPosition;
  this._sourcesByFile = prepped.sourcesByFile;
}

proto._mapStack = function (stack) {
  var self = this;
  stack.forEach(function (x) { 
    var origPosition = self._originalPosition(x.lineNumber, x.columnNumber);
    x.origFile = origPosition.source;
    x.origLineNumber = origPosition.line;
    x.origColumnNumber = origPosition.column;

    // In case that the sourcemap was generated for a javascript file, the column numbers might not have been added
    // In that case it makes sense to assume that it is the same as the generated column number
    if (x.origFile.slice(-3) === '.js' && x.origColumnNumber === 0 && x.columnNumber > 0) {
      x.origColumnNumber = x.columnNumber;
    }

    var sourceLines = self._sourcesByFile[x.origFile];
    if (sourceLines && x.origLineNumber < sourceLines.length) {
      x.sourceLine = sourceLines[x.origLineNumber - 1];
    }
  });
}

proto._rewriteStack = function (stackString, mapped, includeSource) {
  var generatedFile = mapped[0].fileName; 
  var first = true;
  return mapped.reduce(function (acc, x) {
    var regex = new RegExp('[(]*' + generatedFile + '[:]0*' + x.lineNumber + '[:]0*' + x.columnNumber + '[)]*');
    var source = '';
    if (includeSource && first) {
      source += '\n\t"' + x.sourceLine + '"';
      first = false;
    }

    return acc.replace(regex, '(' + x.origFile + ':' + x.origLineNumber + ':' + x.origColumnNumber + ')' + source);
  }, stackString); 
}


proto.map = function (stack, includeSource) {
  // parse expects an error as argument, but only uses stack property of it
  // we want to stay as generic as possible and allow stacks that may have been grabbed from stdout as well
  // therefore taking an Error as argument wouldn't be very helpful
  var parsed = stackTrace.parse({ stack: stack });
  var adapted = cropStack(parsed);

  this._mapStack(adapted);

  return { stack: this._rewriteStack(stack, adapted, includeSource), parsed: adapted };
}
