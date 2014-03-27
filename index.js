var split = require('split'),
    through = require('through');

var filters = require('./src/filters'),
    instrument = require('./src/instrument');

function applyFilters (filters, entry, callback) {
  function next (stack, err, item) {
    if (err || !item) {
      callback(err);
    }
    else if (!stack.length) {
      callback(null, item);
    }
    else {
      stack[0](item, function (err, item) {
        next(stack.slice(1), err, item);
      });
    }
  }

  next(filters, null, entry);
}

function safeJson (data) {
  try {
    return JSON.parse(data);
  }
  catch (e) {
  }
}

var exports = module.exports = function logamaton (opts) {

  var filters = opts.filters || [],
      reports = opts.reports || [];

  function onData (buf) {
    var self = this,
        data = safeJson(buf.toString());

    if (data) {
      applyFilters(filters, data, function (err, data) {
        if (err) {
          return process.stderr.write(err + '\n');
        }
        else if (data) {
          self.queue(data);
        }
      });
    }
  }

  function onEnd (buf) {
    reports.forEach(function (r) {
      r(buf);
    });
  }

  var st = opts.readStream
    .pipe(split())
    .pipe(through(onData, onEnd));

  st.filter = function (f) {
    filters.push(f);
    return st;
  };

  st.report = function (r) {
    reports.push(r);
    return st;
  };

  return st;
};

exports.filters = filters;

exports.instrument = instrument;

