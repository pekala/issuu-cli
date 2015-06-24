var colors = require('colors');
var shell = require('shelljs');

// set theme
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var cols = process.stdout.columns;
var rows = process.stdout.rows;

String.prototype.repeat = function( num ) {
    return new Array( num + 1 ).join( this );
};

exports.info = function(title, item) {
  if (typeof(item) === 'object') {
    console.log(title.warn + ': ');
    for (var i in item) {
      console.log(i.underline + ': ' + item[i]);
    }
  } else {
    console.log(title + ': ' + item.debug);
  }
};

exports.separator = function(title, item) {
  console.log('-'.repeat(cols));
};
