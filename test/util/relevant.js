'use strict';

/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES6, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when 
 * called on other DOM objects.
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
*/
(function () {
    var _slice = Array.prototype.slice;

    try {
        // Can't be used with DOM elements in IE < 9
        _slice.call(document.documentElement); 
    }
    catch (e) { // Fails in IE < 9
        Array.prototype.slice = function (begin, end) {
            var i, arrl = this.length, a = [];
            // Although IE < 9 does not fail when applying Array.prototype.slice
            // to strings, here we do have to duck-type to avoid failing
            // with IE < 9's lack of support for string indexes
            if (this.charAt) { 
                for (i = 0; i < arrl; i++) {
                    a.push(this.charAt(i));
                }
            }
            // This will work for genuine arrays, array-like objects, 
            // NamedNodeMap (attributes, entities, notations),
            // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
            // and will not fail on other DOM objects (as do DOM elements in IE < 9)
            else { 
                // IE < 9 (at least IE < 9 mode in IE 10) does not work with
                // node.attributes (NamedNodeMap) without a dynamically checked length here
                for (i = 0; i < this.length; i++) { 
                    a.push(this[i]);
                }
            }
            // IE < 9 gives errors here if end is allowed as undefined
            // (as opposed to just missing) so we default ourselves
            return _slice.call(a, begin, end || a.length);
        };
    }
}());

var go = module.exports = function (err, nlines) {

  var relevant = err.stack.split('\n').slice(0, nlines);

  // remove location from last trace which points to our test file
  // that location will change all the time, so we don't want it
  var last = relevant.pop();
  relevant.push(last.split(':')[0]);
  return relevant;  
};
