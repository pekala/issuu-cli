#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .command('local [name]', 'link one or more issuu packages')
    .command('nginx [env]', 'set the recipe for nginx')
    .command('grep', 'search across all issuu repos')
    .parse(process.argv);
