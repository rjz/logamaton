# Flog

Logfile automation for JSON logs.

    var entries = flog({
      readStream: fs.createReadStream('./logs.json'),
    });

    entries
      .filter(flog.filters.all())
      .filter(flog.filters.after({
        start: new Date('2014-01-01')
      }))
      .filter(flog.filters.has('err'))
      .report(function (results) {
        console.log(results);
      });

### Filters

Determine whether a given entry from a log is interesting or not. All filters
are instrumented to capture a count of all log entries they receive and a copy
of all entries they match. They may be defined either as arguments to `flog`:

    var filters = [
      flog.filters.all(),
      flog.filters.after({ start: new Date('2014-03-18T02:14:39.151Z') }),
      flog.filters.has('err'),
      flog.filters.where({ level: 40 })
    ];

    flog({
      readStream: process.stdin,
      filters: filters
    });

Or by chaining with `filter`:

    flog({ readStream: process.stdin });
      .filter(flog.filters.all())
      .filter(flog.filters.after({ start: new Date('2014-03-18T02:14:39.151Z') }));

#### Custom Filters

Custom filters may be built using `flog.instrument(name, iter)`:

    var fzbz = flog.instrument('fzbz', function (data, callback) {
      data.fizz = 'buzz';
      callback(null, data);
    });

### Reporters

Reporters inspect filter metrics to summarize the contents of the log. They may
be defined either as arguments to `flog`:

    function aReporter (results) {
      console.log(results.total);
    }

    flog({
      readStream: process.stdin,
      filters: filters,
      reports: [aReporter]
    });

Or by chaining with `report`:

    flog({ readStream: process.stdin })
      .report(function (results) {
        console.log(results.total);
      })

Reports for an individual function may also be recovered from a specific filter
by calling `results()` on the filter.

    var after = flog.filters.after({
      start: new Date('2014-03-18T02:14:39.151Z')
    });

    flog({ readStream: process.stdin })
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

Flog is released under the terms of the JSON license
