var shell = require('shelljs');
var colors = require('colors');
var getFullPackageInfo = require('./getFullPackageInfo');

module.exports = function(packageName) {
    var pkgInfo = getFullPackageInfo(packageName);

    var command =
        'cd ' + pkgInfo.parentPath + ';' +
        'npm unlink ' + pkgInfo.realName + ' -s;' +
        'npm install ' + pkgInfo.realName + ' -s';

    console.log('------ Unlinking '.magenta + pkgInfo.name.bold.magenta + ' by running: ');
    console.log(command.replace(/;/g, '\n').cyan);

    var result = shell.exec(command, {
        silent: false
    });

    if (result.code) {
        console.log('------  Problems with unlinking '.red + pkgInfo.name.red + '\n');
    } else {
        console.log('------ ' + pkgInfo.name.green + ' unlinked'.green + '\n');
    }
};
