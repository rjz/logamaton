var fs = require('fs'),
    path = require('path');

var flog = require('..');

var stack = [
  flog.filters.all(),
  flog.filters.after({ start: new Date('2014-03-18T02:14:39.151Z') }),
  flog.filters.has('err'),
  flog.filters.where({ level: 40 })
];

var last = flog.filters.all();

function reporter () {
  console.log(last.results().matches);
}

var fzbz = flog.instrument('fzbz', function (data, callback) {
  data.fizz = 'buzz';
  callback(null, data);
});

flog({
  readStream: fs.createReadStream(path.resolve(__dirname, './logs.json')),
  filters: stack,
  reports: [reporter]

})
  .filter(fzbz)
  .filter(last)
  .report(reporter);

