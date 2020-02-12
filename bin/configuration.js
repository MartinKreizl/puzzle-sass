const merge = require("deepmerge");
const path = require("path");

function loadConfigFile(customFile) {
    let file = customFile || "puzzleSass.config.js";

    return require(path.join(process.cwd(), file));
}

function finalizeConfig(config) {
    return merge({
        modules: ["typography", "spacing", "flex"],
        theme: {
            spacing: x => `${x * 8}px`,
        }
    }, config);
}

module.exports = {
    loadConfigFile,
    finalizeConfig,
};