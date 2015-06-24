var ISSUU_HOME = process.env.ISSUU_HOME;

module.exports = function() {
    return ISSUU_HOME + '/.savedLinks.json'
}
