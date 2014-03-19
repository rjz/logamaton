module.exports = function reporter (name, mw) {

  var total = 0,
      matches = [];

  var instrumented = function (entry, callback) {
    var c = function (err, entry) {
      if (entry) {
        matches.push(entry);
      }
      return callback(err, entry);
    };

    total = total + 1;
    return mw (entry, c);
  };

  instrumented.results = function () {
    return {
      name: name,
      total: total,
      matches: matches
    };
  };

  return instrumented;
};

