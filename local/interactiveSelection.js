var inquirer = require('inquirer');
var _ = require('lodash');
var colors = require('colors');
var getLinkingState = require('./getLinkingState');
var unlinkPackage = require('./unlinkPackage');
var linkPackage = require('./linkPackage');

module.exports = function() {
    var packages = getLinkingState({
        flatten: true
    });

    inquirer.prompt([{
        type: 'checkbox',
        message: 'Select packages you want to develop',
        name: 'packages',
        choices: _.map(packages, function(pkg) {
            //color linked packages names
            var label = pkg.isLocal ? pkg.name.cyan : pkg.name;

            //indent second level packages
            if (pkg.parentName) {
                label = '\t' + label;
            }

            //show version number or branch name
            var postfix = pkg.version || pkg.currentBranch;

            return {
                name: label + ' ' + postfix.magenta,
                value: pkg.name,
                checked: !!pkg.isLocal,
                disabled: !pkg.localPath ? 'repository not cloned' : false
            };
        })
    }], function(anwsers) {
        //get all currently linked packages
        var currentPackages = _(packages).where({
            isLocal: true
        }).pluck('name').value();

        //calculated packages selected and unselected
        var toLink = _.difference(anwsers.packages, currentPackages);
        var toUnlink = _.difference(currentPackages, anwsers.packages);

        //for each selected package, display a choice of branch
        //defaulting to currently selected branch
        var prompts = _.map(toLink, function(pkg) {
            pkg = _.findWhere(packages, {
                name: pkg
            });
            return {
                type: 'list',
                name: pkg.name,
                message: 'Select branch for ' + pkg.name.cyan,
                choices: pkg.branches,
                default: pkg.currentBranch
            };
        });

        inquirer.prompt(prompts, function(finalToLink) {
            if (toLink.length) {
                console.log('Will be linked: '.bold, toLink.join(', '));
            }
            if (toUnlink.length) {
                console.log('Will be unlinked: '.bold, toUnlink.join(', '));
            }
            if (!toLink.length && !toUnlink.length) {
                console.log('Nothing to do here'.magenta);
            }
            console.log('');
            _.each(toUnlink, function(pkg) {
                unlinkPackage(pkg);
            });
            _.each(finalToLink, function(branch, packageName) {
                linkPackage(packageName);
            });
            process.exit();
        });
    });
};
