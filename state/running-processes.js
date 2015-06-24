var shell = require('shelljs');
var fs = require('fs');
var nginxConf = null;

var helpers = require('../shared/helpers');

var SILENT = true;

exports.get = function() {
    var obj = {};
    var paths = [];
    // All issuu projects (sort of...)
    var issuuFolder = helpers.getIssuuFolder();
    fs.readdirSync('../').forEach(function(fileName) {
        paths.push(issuuFolder + fileName);
    });

    // get all processes running started with the keyboard
    var tty = shell.exec('ps -e | grep tty', {
        silent: SILENT
    }).output;
    var arr = tty.split('\n');

    arr.forEach(function(value) {
        var pid = value.split(' ')[0];
        // TODO: This is vey slow, could perhaps be improved
        var pidPathName = shell.exec('lsof -p ' + pid + ' | grep cwd', {
            silent: SILENT
        }).output;
        if (!pidPathName.match(/bash/) && !pidPathName.match(/issuu-cli/)) {
            pidPathName = pidPathName.match(/[^ ]+$/);
            pidPathName = pidPathName ? pidPathName[0] : '';

            paths.forEach(function(pathName) {
                if (pidPathName.indexOf(pathName) != -1) {
                    obj[pathName.replace(issuuFolder, '')] = true;
                }
            });
        }
    });

    var res = '';
    for (var i in obj) {
        res += i + ' ';
    }

    return res;
};
