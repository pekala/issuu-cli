var _ = require('lodash');
var moment = require('moment');
var jf = require('jsonfile');
var getSavedStates = require('./getSavedStates');
var getLinkingState = require('./getLinkingState');

module.exports = function(name) {
    var savedStates = getSavedStates() || [];

    //get all currently linked packages
    var currentPackages = _(getLinkingState({
        flatten: true
    })).where({
        isLocal: true
    }).pluck('name').value();

    if (currentPackages.length) {
        console.log('Currently linked: ', currentPackages.join(', '));
    }

    savedStates.push({
        saved: moment().unix(),
        name: name,
        links: currentPackages
    });

    var file = './data.json';
    jf.writeFileSync(file, savedStates);

    process.exit();
};
