var shell = require('shelljs');
var _ = require('lodash');
var getLocalPackagePath = require('./getLocalPackagePath');

//by default don't show the output in the terminal
shell.config.silent = true;

var ISSUU_HOME = process.env.ISSUU_HOME;
var _options = {
    depth: 1,
    getBranches: true,
    flatten: false
};

//npmList - json from `npm list --json` output
//parentName - name of the parent package, used when called recursively
function parseNPMListJSON(npmList, parentName) {
    var packages = _.map(npmList, function(pkg, pkgFullName) {
        //only parse issuu packages
        if (pkgFullName.indexOf('issuu-') === -1) {
            return;
        }

        //get path to the package root folder in the local cloned repository
        var localPath = getLocalPackagePath(pkgFullName);

        //get repository branches names and current branch
        var branches, currentBranch;
        if (localPath && _options.getBranches) {
            //get available branches with git's branch command
            branches = shell.exec('cd ' + localPath + '; git branch').output.split('\n');
            //current branch name is marked with '*' in git's output
            currentBranch = _(branches).find(function(branch) {
                return branch.indexOf('*') !== -1;
            }).replace('*', '').trim();
            //format branch names by removing the * and whitespace
            branches = _(branches).compact().map(function(branch) {
                return branch.replace('*', '').trim();
            }).value();
        }

        //get rid of issuu= prefix in the name and prefix with parent's name
        var name = pkgFullName.replace('issuu-', '');
        if (parentName) {
            name = parentName + '/' + name;
        }

        //packages without resolved path are linked
        var isLocal = !pkg.resolved;

        //don't provide version for local packaged,
        //since it's incorrect, i.e. w/o patch version
        var version = !isLocal && pkg.version;

        //recuresively parse package's dependiences, if the exists and package is linked
        var dependencies = (isLocal && pkg.dependencies) ? parseNPMListJSON(pkg.dependencies, name) : [];

        return {
            name: name,
            isLocal: isLocal,
            version: version,
            localPath: localPath,
            parentName: parentName,
            currentBranch: currentBranch,
            branches: branches,
            dependencies: dependencies
        };
    });

    return _.compact(packages); //get rid of undefined packages (non-issuu)
}

module.exports = function(options) {
    _options = _.defaults(options || {}, _options);

    //get npm list for fe-webserver package
    var npmList = JSON.parse(shell.exec(
        'cd ' + ISSUU_HOME + '/fe-webserver;' +
        'npm list --json --depth=' + _options.depth + ' --silent'
    ).output);

    //parse the dependency tree
    var packages = parseNPMListJSON(npmList.dependencies);

    if (_options.flatten) {
        var flattenPackages = _.clone(packages);
        //flatten packages list (first and second level pkgs in one array)
        _.each(packages, function(pkg, index) {
            var parent = _.findWhere(flattenPackages, {
                name: pkg.name
            });
            var args = [flattenPackages.indexOf(parent) + 1, 0].concat(pkg.dependencies);
            Array.prototype.splice.apply(flattenPackages, args);
        });

        return flattenPackages;
    } else {
        return packages;
    }
};
