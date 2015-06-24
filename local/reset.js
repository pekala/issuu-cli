var shell = require('shelljs');
var colors = require('colors');
var ISSUU_HOME = process.env.ISSUU_HOME;

module.exports = function(packageName) {
    var command =
        'cd ' + ISSUU_HOME + '/fe-webserver;' +
        'npm update -s;';

    console.log('------ Resetting linking state'.magenta);
    console.log('Running: \n'.bold.cyan + command.replace(/;/g, '\n').cyan);

    var result = shell.exec(command, {
        silent: false
    });

    if (result.code) {
        console.log('------  Problems with resetting linking state '.red);
    } else {
        console.log('------ Linking state reset'.green);
    }

    process.exit();
};
