var instrument = require('./instrument');

var filters = module.exports;

filters.all = function () {
  return instrument('all', function all (entry, callback) {
    callback(null, entry);
  });
};

filters.after = function (opts) {
  var startDate = (opts && opts.start) ? opts.start : Date.now();
  return instrument('after', function isTimely (entry, callback) {
    if (new Date(entry.time) < startDate) {
      return callback(null, entry);
    }
    callback(null);
  });
};

filters.has = function (key) {
  return instrument('has', function has (entry, callback) {
    if (entry.hasOwnProperty(key)) {
      return callback(null, entry);
    }
    callback(null);
  });
};

filters.where = function (m) {
  return instrument('where', function where (entry, callback) {
    var keys = Object.keys(m);
    if (keys.length === keys.filter(function (k) {
      return entry[k] === m[k];
    }).length) {
      return callback(null, entry);
    }
    callback(null);
  });
};

