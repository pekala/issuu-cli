#!/usr/bin/env node

var program = require('commander');

program
    .option('-s, --save', 'save current link state')
    .option('-l, --load', 'load saved link state')
    .option('-a, --list', 'list saved link states')
    .parse(process.argv);

if (program.list) {
    console.log('listing all saved link states');
    process.exit();
}

if (program.load) {
    console.log('loading "%s" link state', program.args);
    process.exit();
}

if (program.save) {
    console.log('saving current link state as %s', program.args);
    process.exit();
}

var pkgs = program.args;

if (!pkgs.length) {
    console.log('displaying current link configuration');
    process.exit();
}

pkgs.forEach(function(pkg) {
    console.log('linking : %s', pkg);
});
