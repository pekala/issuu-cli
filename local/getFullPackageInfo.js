var getLocalPackagePath = require('./getLocalPackagePath');
var getRealPackageName = require('./getRealPackageName');
var packagesInfo = require('../packagesInfo.json');

var ISSUU_HOME = process.env.ISSUU_HOME;

module.exports = function(packageName) {
    var parentName, parentPath;
    if (packageName.indexOf('/') !== -1) {
        parentName = packageName.split('/')[0];
        parentName = getRealPackageName(parentName);
        parentPath = getLocalPackagePath(parentName);
    }
    parentPath = parentPath || ISSUU_HOME + '/fe-webserver';

    realPackageName = getRealPackageName(packageName);
    var packagePath = getLocalPackagePath(realPackageName);

    return {
        name: packageName,
        path: packagePath,
        realName: realPackageName,
        parentName: parentName,
        parentPath: parentPath,
        postlink: packagesInfo[realPackageName].postlink
    };
};
