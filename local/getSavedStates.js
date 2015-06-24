var jf = require('jsonfile');
var getDataFile = require('./getDataFile');

module.exports = function() {
    return jf.readFileSync(getDataFile(), {
        throws: false
    });
};
