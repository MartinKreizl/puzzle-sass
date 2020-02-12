#!/usr/bin/env node

const configuration = require("./configuration");
const muiSystem = require("@material-ui/system");
const muiTheme = require("@material-ui/core/styles/createMuiTheme").default;

try {
    let cfg = configuration.loadConfigFile();
    console.log(cfg, configuration.finalizeConfig(cfg));
} catch(err) {
    console.error("No configuration file.", err);
}
