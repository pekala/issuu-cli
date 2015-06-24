var _ = require('lodash');
var moment = require('moment');
var jf = require('jsonfile');
var Moniker = require('moniker');
var getSavedStates = require('./getSavedStates');
var getLinkingState = require('./getLinkingState');
var getDataFile = require('./getDataFile');

var nameGenerator = Moniker.generator([Moniker.adjective, Moniker.noun]);

module.exports = function(name) {
    var savedStates = getSavedStates() || [];

    //get all currently linked packages
    var currentPackages = _(getLinkingState({
        flatten: true
    })).where({
        isLocal: true
    }).pluck('name').value();

    if (currentPackages.length) {
        name = name || nameGenerator.choose([Moniker.noun]);
        savedStates.push({
            saved: moment().unix(),
            name: name,
            links: currentPackages
        });

        jf.writeFileSync(getDataFile(), savedStates);

        console.log('Currently linked: ', currentPackages.join(', ') + ' saved as ' + name.magenta);
    } else {
        console.log('You don\'t link any packages')
    }

    process.exit();
};
