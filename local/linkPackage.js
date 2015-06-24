var shell = require('shelljs');
var colors = require('colors');
var getFullPackageInfo = require('./getFullPackageInfo');

module.exports = function(packageName) {
    var pkgInfo = getFullPackageInfo(packageName);

    var command =
        'cd ' + pkgInfo.path + ';' +
        'npm link -s;' +
        'cd ' + pkgInfo.parentPath + ';' +
        'npm link ' + pkgInfo.realName + ' -s';

    console.log('------ Linking '.magenta + pkgInfo.name.bold.magenta + ' by running: ');
    console.log(command.replace(/;/g, '\n').cyan);


    var result = shell.exec(command, {
        silent: false
    });

    if (result.code) {
        console.log('------ Problems with linking '.red + pkgInfo.name.red + '\n');
    } else {
        console.log('------ ' + pkgInfo.name.green + ' linked'.green + '\n');
    }
};
