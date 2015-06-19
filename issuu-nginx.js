#!/usr/bin/env node

var program = require('commander');

program.parse(process.argv);

var recipes = program.args;

if (!recipes.length) {
    console.error('No recipie provided');
    program.exit(1);
}

console.log('Using nginx conf: ');
recipes.forEach(function(recipe) {
    console.log(recipe);
});
