module.exports = function(packageName) {
    //if package name contains '/' strip the parent's package name
    if (packageName.indexOf('/') !== -1) {
        packageName = packageName.split('/').pop();
    }

    //if package name has no issuu- prefix, append it
    if (packageName.indexOf('issuu-') === -1) {
        packageName = 'issuu-' + packageName;
    }

    return packageName;
};
