const sass = require("node-sass");
const fs = require("fs");
const {getDeepValue} = require("./helpers");

function compile(config) {
    let {sass: sassConfig, outputFile, inputFile} = config;

    sass.render({
        ...sassConfig,
        file: inputFile,
        functions: createFunctionsFromTheme(config.theme),
    }, (error, result) => {
        //console.log("DEBUG", _debug);

        if (error) {
            console.error(error);
            process.exit(1);
        }

        fs.writeFileSync(outputFile, result.css);
    });
}

/**
 * Create sass function which is called by sass in compilation time
 * @param value {any} part of theme object
 * */
function createSassFunction(value) {
    /**
     * @param sassArg {sass.types.Map}
     * */
    return function (sassArg) {
        let result;

        if (typeof value === "function") {
            let args = [];
            for(let i = 0; i < sassArg.getLength(); i++) {
                args.push(sassArg.getValue(i).getValue());
            }
            result = value(...args); //call underlying javascript function with arguments
        } else {
            let arg = sassArg.getValue(0).getValue(); //expected to be path.subpath...
            result = getDeepValue(arg.toString(), value);
        }

        if (Array.isArray(result)) {
            let l = result.length;
            let list = new sass.types.List(l);
            result.forEach((v, i) => list.setValue(i, new sass.types.String(v.toString())));
            return list;
        } else if (typeof result === "object") {
            let entries = Object.entries(result);
            let l = entries.length;
            let map = new sass.types.Map(l);

            entries.forEach(([k, v], i) => {
                map.setKey(i, new sass.types.String(k.toString()));
                map.setValue(i, new sass.types.String(v.toString()));
            });

            return map;
        } else {
            return new sass.types.String(result.toString());
        }
    }
}

/**
 * Get sass function signature
 * @param functionName {string}
 * @return {string}
 * */
function getFunctionSignature(functionName) {
    return `${functionName}($arguments...)`;
}


/**
 * Creates functions according to theme configuration object
 * @param theme {object}
 * @return {object} list of functions
 * */
function createFunctionsFromTheme(theme) {
    let functions = {};

    for(let module in theme) {
        functions[getFunctionSignature(module)] = createSassFunction(theme[module]);

        for (let submodule in theme[module]) {
            if (typeof theme[module][submodule] === "function") {
                functions[getFunctionSignature(`${module}_${submodule}`)] = createSassFunction(theme[module][submodule])
            }
        }
    }

    return functions;
}

module.exports = compile;
