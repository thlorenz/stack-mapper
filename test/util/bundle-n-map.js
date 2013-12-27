'use strict';
var path       =  require('path')
  , vm         =  require('vm')
  , browserify =  require('browserify')
  , convert    =  require('convert-source-map')

var go = module.exports = function (dir, cb) {

  var entry = path.join(__dirname, '..', dir, 'main.js');
  browserify()
    .require(entry)
    .bundle({ debug: true }, function (err, src) {
      if (err) return cb(err);

      var map = convert.fromSource(src).toObject();
      var require_ = vm.runInNewContext(src, { }, '/full/path/to/bundle.js');
      var main = require_(entry);

      cb(null, { src: src, map: map, main: main })
    });
}

// Test
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

if (!module.parent && typeof window === 'undefined') {
  go('onefile', function (err, res) {
    if (err) return console.error(err);
    inspect(res);      
  });
}
