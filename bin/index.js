#!/usr/bin/env node

const loadConfiguration = require("./configuration");
const compile = require("./compilation");

let cfg = loadConfiguration();

compile(cfg);
