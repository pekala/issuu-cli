var inquirer = require('inquirer');
var shell = require('shelljs');
var _ = require('lodash');
var colors = require('colors');
var packagesInfo = require('../packagesInfo.json');
var fs = require('fs');

var ISSUU_HOME = process.env.ISSUU_HOME;
shell.config.silent = true;

function parseNPMListJSON(npmList, parentName) {
    return _(npmList).map(function(pkg, name) {
        if (name.indexOf('issuu-') === -1) {
            return;
        }
        var path = ISSUU_HOME + '/' + packagesInfo[name].path;
        var localRepoOK = fs.existsSync(path);
        var branches, currentBranch;
        if (localRepoOK) {
            branches = shell.exec('cd ' + path + '; git branch').output.split('\n');
            currentBranch = _(branches).find(function(branch) {
                return branch.indexOf('*') !== -1;
            }).replace('*', '').trim();
        }
        name = name.replace('issuu-', '');
        if (parentName) {
            name = parentName + '/' + name;
        }
        return {
            name: name,
            isLocal: !pkg.resolved,
            version: pkg.resolved && pkg.version,
            localRepoOK: localRepoOK,
            parentName: parentName,
            currentBranch: currentBranch,
            dependencies: (pkg.dependencies && !pkg.resolved) ? parseNPMListJSON(pkg.dependencies, name) : [],
            branches: _(branches).compact().map(function(branch) {
                return branch.replace('*', '').trim();
            }).value()
        };
    }).compact().value();
}

module.exports = function() {
    var npmList = shell.exec('cd ' + ISSUU_HOME + '/fe-webserver; npm list --json --depth=1 --silent').output;
    npmList = JSON.parse(npmList);

    var packages = parseNPMListJSON(npmList.dependencies);
    var allPackages = _.clone(packages);
    _.each(packages, function(pkg, index) {
        var parent = _.findWhere(allPackages, {
            name: pkg.name
        });
        var args = [allPackages.indexOf(parent) + 1, 0].concat(pkg.dependencies);
        Array.prototype.splice.apply(allPackages, args);
    });

    inquirer.prompt([{
        type: "checkbox",
        message: "Select packages you want to develop",
        name: "packages",
        choices: _.map(allPackages, function(pkg) {
            var label = pkg.isLocal ? pkg.name.cyan : pkg.name;
            if (pkg.parentName) {
                label = '\t' + label;
            }
            var version = pkg.version || pkg.currentBranch;
            return {
                name: label + ' ' + version.magenta,
                value: pkg.name,
                checked: !!pkg.isLocal,
                disabled: !pkg.localRepoOK ? "repository not cloned" : false
            };
        }),
        filter: function(toLink) {
            return _.map(toLink, function(pkg) {
                return pkg.strip;
            });
        }
    }], function(anwsers) {
        var currentPackages = _(allPackages).where({
            isLocal: true
        }).pluck('name').value();

        var toLink = _.difference(anwsers.packages, currentPackages);
        var toUnink = _.difference(currentPackages, anwsers.packages);

        var prompts = _.map(toLink, function(pkg) {
            pkg = _.findWhere(allPackages, {
                name: pkg
            });
            return {
                type: "list",
                name: pkg.name,
                message: "Select branch for " + pkg.name.cyan,
                choices: pkg.branches,
                default: pkg.currentBranch
            };
        });

        inquirer.prompt(prompts, function(finalAnwsers) {
            console.log("Will be linked: ", finalAnwsers);
            console.log("Will be unlinked: ", toUnink);
        });
    });
};
