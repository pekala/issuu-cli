#!/usr/bin/env node

var program = require('commander');
var inquirer = require('inquirer');
var shell = require('shelljs');
var _ = require('lodash');

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
    var packages = shell.exec('cd ~/Dev/fe-webserver; npm list --depth=0 | grep issuu-', {
        silent: true
    }).output;
    var packages = _(packages.split('\n')).filter(function(pkg) {
        return pkg.indexOf('├──') !== -1;
    }).map(function(pkg) {
        pkg = pkg.replace('├── ', '');
        if (pkg.indexOf(' -> ') !== -1) {
            var branch = shell.exec('cd ' + pkg.split(' -> ')[1] + '; git branch | grep "*"', {
                silent: true
            }).output.replace('\n', '');
            return {
                name: pkg.split(' -> ')[0].split('@')[0],
                version: branch,
                local: true
            };
        } else {
            return {
                name: pkg.split('@')[0],
                version: pkg.split('@')[1]
            };
        }
    }).value();

    inquirer.prompt([{
        type: "checkbox",
        message: "Select packages to link",
        name: "packages",
        choices: _(packages).map(function(pkg) {
            return {
                name: pkg.name + ' ' + pkg.version,
                checked: !!pkg.local
            };
        }).value(),
        validate: function(answer) {
            return true;
        }
    }], function(answers) {
        console.log(JSON.stringify(answers, null, "  "));
        process.exit();
    });
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
