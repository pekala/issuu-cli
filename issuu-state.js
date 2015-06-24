#!/usr/bin/env node

var shell = require('shelljs');
var program = require('commander');
var ProgressBar = require('progress');

var output = require('./shared/output');

var bar = new ProgressBar(':bar:percent', {
    total: 3,
    width: 50
});
var nginx = require('./state/nginx').get();
bar.tick();
var runningProcesses = require('./state/running-processes').get();
bar.tick();
var git = require('./state/git').get();
bar.tick();

output.separator();
output.info('Nginx is running with configuration', nginx);
output.separator();
output.info('You have processes running in these folders', runningProcesses);
output.separator();
output.info('You have uncomitted changes in these projects', git);
output.separator();
