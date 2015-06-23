var shell = require('shelljs');
var fs = require('fs');

var helpers = require('../misc/helpers');

var issuuFolder = helpers.getIssuuFolder();

exports.get = function() {
    var obj = {};

    fs.readdirSync(issuuFolder).forEach(function (folder) {
        var project = issuuFolder + folder;
        var status = shell.exec('git -C ' + project + ' diff --exit-code | grep +++', {silent:true}).output;
        if (status) {
            obj[folder.replace('/', '')] = status.replace(/\+\+\+ b/g, '').split('\n').join(', ');
        }
    });

    return obj;
};
