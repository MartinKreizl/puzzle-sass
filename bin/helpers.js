/**
 * Get value from structure tree
 * @param path {string}
 * @param struct {object}
 * */
function getDeepValue(path, struct) {
    return path.split(".").reduce(function(acc, curr) {
        return acc === undefined ? undefined : acc[curr];
    }, struct);
}

module.exports = {
    getDeepValue
};