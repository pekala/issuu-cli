var jf = require('jsonfile');

module.exports = function() {
    var file = './data.json';
    return jf.readFileSync(file);
};
