const merge = require("deepmerge");
const path = require("path");
const {getDeepValue} = require("./helpers");
const muiTheme = require("@material-ui/core/styles/createMuiTheme").default;

/**
 * Doing all work including load, merge and validate configuration
 * @param customFile {string} specify custom configuration file
 * */
function loadConfiguration(customFile) {
    let fileName = customFile || "puzzleSass.config.js";
    let filePath = path.join(process.cwd(), fileName);
    let config;

    try {
        config = require(filePath);
    } catch(err) {
        throw new Error(`No configuration file found for ${filePath}`);
    }

    config = finalizeConfig(config);
    validateConfig(config);

    config.theme = muiTheme(config.theme);

    return config;
}

/**
 * Merge defaults with user defined config. User config has higher priority
 * @param config {object}
 * */
function finalizeConfig(config) {
    return merge({
        inputFile: "style.scss",
        outputFile: "style.css",
        theme: {
            spacing: x => `${x * 8}px`,
        },
        sass: {
            includePaths: [path.resolve(__dirname, "..")]
        }
    }, config);
}

/**
 * Validates passed configuration
 * @param config {object}
 * */
function validateConfig(config) {
    [
        "inputFile",
        "outputFile"
    ].forEach(function (configPath) {
        isEmptyEntry(configPath, config);
    });
}

function isEmptyEntry(needle, data) {
    let value = getDeepValue(needle, data);

    if (Boolean(value) === false) {
        throw new Error(`config.${needle} must not be ${value}`);
    }
}

module.exports = loadConfiguration;