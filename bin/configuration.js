const merge = require("deepmerge");
const path = require("path");
const {getDeepValue} = require("./helpers");
const createMuiTheme = require("@material-ui/core/styles/createMuiTheme").default;
const {lighten, darken} = require("@material-ui/core/styles/colorManipulator");

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

    //here we have access to final version of configuration
    config.theme.getSurfaceList = function() {
        let variants = {};

        for(let key in config.theme.palette) {
            let value = config.theme.palette[key];

            if (typeof value === "object") {
                Object.entries(value).forEach(function ([k, v]) {
                    if (config.modules.surface.permittedVariants.indexOf(k) !== -1) {
                        variants[`${key}-${k}`] = v;
                    }
                });
            }
        }

        return variants;
    };

    validateConfig(config);
    config.theme = createMuiTheme(config.theme);

    // modify original breakpoints functions for better suit for sass
    ["up", "down", "between", "only"].forEach(function (breakpoint) {
        let originalFunc = config.theme.breakpoints[breakpoint];
        config.theme.breakpoints[breakpoint] = function (...args) {
            return originalFunc(...args).replace("@media", "");
        }
    });

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
            colors: {
                lighten,
                darken,
            },
            camelToCss: (camelCase) => camelCase.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`),
        },
        modules: {
            flex: {

            },
            grid: {
                columnCount: 12,
                gutterCount: 8,
            },
            ngrid: { //native grid
                columnCount: 12,
                rowCount: 2,
            },
            spacing: {
                maxSpaces: 12,
                spaceFactor: 1,
            },
            typography: {

            },
            surface: {
                permittedVariants: ["main", "light", "dark", "100", "200", "300", "400", "500", "paper"]
            }
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