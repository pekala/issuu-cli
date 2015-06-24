var fs = require('fs');
var packagesInfo = require('../packagesInfo.json');
var getRealPackageName = require('./getRealPackageName');

var ISSUU_HOME = process.env.ISSUU_HOME;
var paths = [];

module.exports = function(packageName) {
    packageName = getRealPackageName(packageName);

    //get cached path if exists
    if (paths[packageName]) {
        return paths[packageName];
    }

    //path to the package root folder in the local cloned repository
    var pkgPath = ISSUU_HOME + '/' + packagesInfo[packageName].path;

    //if the folder exists return path, else return false
    //cache the result and return
    paths[packageName] = fs.existsSync(pkgPath) && pkgPath;
    return paths[packageName];
};
