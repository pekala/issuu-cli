#!/usr/bin/env node

var program = require('commander');

program.parse(process.argv);

var searchTerms = program.args;

if (!searchTerms.length) {
    console.error('Nothing to search for :(');
    program.exit(1);
}

console.log('searching for: ');
searchTerms.forEach(function(searchTerm) {
    console.log(searchTerm);
});
