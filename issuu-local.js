#!/usr/bin/env node

var program = require('commander');
var interactiveLinking = require('./local/interactive');

program
    .option('-s, --save', 'save current link state')
    .option('-l, --load', 'load saved link state')
    .option('-a, --list', 'list saved link states')
    .option('-r, --reset', 'removes all local links')
    .parse(process.argv);

if (program.list) {
    console.log('listing all saved link states');
    process.exit();
}

if (program.reset) {
    console.log('resets linking state');
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
    interactiveLinking();
}

pkgs.forEach(function(pkg) {
    var pkgName = pkg.split('#')[0];
    var pkgBranch = pkg.split('#')[1];
    var pkgVersion = pkg.split('@')[1];
    if (pkgBranch) {
        console.log('linking : %s branch %s', pkgName, pkgBranch);
    } else if (pkgVersion) {
        console.log('linking : %s version %s', pkgName, pkgVersion);
    } else {
        console.log('linking : %s', pkgName);
    }
});
