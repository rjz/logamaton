# Logamaton

Logfile automation for JSON logs.

    var logamaton = require('logamaton');

    var entries = logamaton({
      readStream: fs.createReadStream('./logs.json'),
    });

    entries
      .filter(logamaton.filters.all())
      .filter(logamaton.filters.after({
        start: new Date('2014-01-01')
      }))
      .filter(logamaton.filters.has('err'))
      .report(function (results) {
        console.log(results);
      });

## Installation

    $ npm install logamaton

### Filters

Determine whether a given entry from a log is interesting or not. All filters
are instrumented to capture a count of all log entries they receive and a copy
of all entries they match. They may be defined either as arguments to `logamaton`:

    var filters = [
      logamaton.filters.all(),
      logamaton.filters.after({ start: new Date('2014-03-18T02:14:39.151Z') }),
      logamaton.filters.has('err'),
      logamaton.filters.where({ level: 40 })
    ];

    logamaton({
      readStream: process.stdin,
      filters: filters
    });

Or by chaining with `filter`:

    logamaton({ readStream: process.stdin });
      .filter(logamaton.filters.all())
      .filter(logamaton.filters.after({ start: new Date('2014-03-18T02:14:39.151Z') }));

#### Custom Filters

Custom filters may be built using `logamaton.instrument(name, iter)`:

    var fzbz = logamaton.instrument('fzbz', function (data, callback) {
      data.fizz = 'buzz';
      callback(null, data);
    });

### Reporters

Reporters inspect filter metrics to summarize the contents of the log. They may
be defined either as arguments to `logamaton`:

    function aReporter (results) {
      console.log(results.total);
    }

    logamaton({
      readStream: process.stdin,
      filters: filters,
      reports: [aReporter]
    });

Or by chaining with `report`:

    logamaton({ readStream: process.stdin })
      .report(function (results) {
        console.log(results.total);
      })

Reports for an individual function may also be recovered from a specific filter
by calling `results()` on the filter.

    var after = logamaton.filters.after({
      start: new Date('2014-03-18T02:14:39.151Z')
    });

    logamaton({ readStream: process.stdin })
      .filter(after)
      .report(function () {
        console.log(after.results().matches);
      });

### TODO

More filtering, more reporting, more analytics. Test coverage. Benchmarking.

## Contributing

Have something to add? Contributions are enormously welcome!

  1. Fork this repo
  2. Update the spec and implement the change
  3. Submit a [pull request](help.github.com/pull-requests/)

## License

Logamaton is released under the terms of the JSON license

