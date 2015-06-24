#!/usr/bin/env node

var program = require('commander');
var interactiveSelection = require('./local/interactiveSelection');
var resetLinkingState = require('./local/reset');
var linkPackage = require('./local/linkPackage');
var listSavedStates = require('./local/listSavedStates');
var loadSavedStates = require('./local/loadSavedStates');
var saveStates = require('./local/saveState');

program
    .option('-s, --save', 'save current link state')
    .option('-l, --load', 'load saved link state')
    .option('-a, --list', 'list saved link states')
    .option('-r, --reset', 'removes all local links')
    .parse(process.argv);

if (program.list) {
    listSavedStates();
}

if (program.reset) {
    resetLinkingState();
}

if (program.load) {
    loadSavedStates();
}

if (program.save) {
    saveStates(program.args[0]);
}

var pkgs = program.args;

if (!program.load && !pkgs.length) {
    interactiveSelection();
}

pkgs.forEach(function(pkg) {
    var packageName = pkg.split('#')[0];
    var packageBranch = pkg.split('#')[1];

    if (packageBranch) {
        console.log('linking : %s branch %s', packageName, packageBranch);
        linkPackage(packageName, packageBranch);
    } else {
        console.log('linking : %s', packageName);
        linkPackage(packageName);
    }
});
