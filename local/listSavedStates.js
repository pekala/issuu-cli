var _ = require('lodash');
var moment = require('moment');
var colors = require('colors');
var getSavedStates = require('./getSavedStates');

module.exports = function() {
    _.each(getSavedStates() || [], function(state) {
        var links = _.map(state.links, function(link) {
            var name = link.split('#')[0];
            var branchName = link.split('#')[1];
            return name.cyan + (branchName ? (' #' + branchName.red) : '');
        }).join(', ');
        console.log('"%s" saved %s:\n [%s]', state.name.bold.magenta, moment.unix(state.saved).fromNow(), links);
    });

    process.exit();
};
