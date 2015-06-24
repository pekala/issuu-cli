var _ = require('lodash');
var moment = require('moment');
var colors = require('colors');
var inquirer = require('inquirer');
var getSavedStates = require('./getSavedStates');
var getLinkingState = require('./getLinkingState');
var unlinkPackage = require('./unlinkPackage');
var linkPackage = require('./linkPackage');

module.exports = function() {
    var savedStates = getSavedStates();
    var choices = _.map(savedStates, function(state) {
        var links = _.map(state.links, function(link) {
            var name = link.split('#')[0];
            var branchName = link.split('#')[1];
            return name.bold.magenta + (branchName ? (' #'.green + branchName.green) : '');
        }).join(', ');
        var label = state.name + ' (saved ' + moment.unix(state.saved).fromNow() + '): ' + links;
        return {
            name: label,
            value: state.name
        };
    });

    var prompt = [{
        type: 'list',
        name: 'state',
        message: 'Select state to load',
        choices: choices
    }];

    inquirer.prompt(prompt, function(anwser) {
        var chosenState = _.findWhere(savedStates, {
            name: anwser.state
        });

        var chosenPackages = _.map(chosenState.links, function(link) {
            return link.split('#')[0];
        });

        //get all currently linked packages
        var currentPackages = _(getLinkingState({
            flatten: true
        })).where({
            isLocal: true
        }).pluck('name').value();

        //calculated packages selected and unselected
        var toLink = _.difference(chosenPackages, currentPackages);
        var toUnlink = _.difference(currentPackages, chosenPackages);

        if (currentPackages.length) {
            console.log('Currently linked: ', currentPackages.join(', '));
        }
        if (!toLink.length && !toUnlink.length) {
            console.log('Nothing to do here'.magenta);
        }
        if (toLink.length) {
            console.log('Will be linked: '.green, toLink.join(', '));
        }
        if (toUnlink.length) {
            console.log('Will be unlinked: '.red, toUnlink.join(', '));
        }

        console.log('');

        _.each(toUnlink, function(packageName) {
            unlinkPackage(packageName);
        });

        _.each(toLink, function(packageName) {
            linkPackage(packageName);
        });

        process.exit();
    });
};
