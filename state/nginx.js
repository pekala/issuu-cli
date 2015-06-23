var shell = require('shelljs');
var nginxConf = null;

exports.get = function() {
    var nginxRunning = shell.exec('ps waux | grep nginx', {silent: true}).output;
    if (nginxRunning) {
        nginxConf = nginxRunning.split('nginx-')[1].split('.conf')[0];
    }

    return nginxConf;
};
