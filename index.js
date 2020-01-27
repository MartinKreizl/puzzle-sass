const sass = require("node-sass");
const fs = require("fs");
const muiSystem = require("@material-ui/system");
const muiTheme = require("@material-ui/core/styles/createMuiTheme").default;

const theme = muiTheme({
   palette: {
      primary: {
         main: "#0080FF",
      },
      secondary: {
         main: "#FFAD00",
      }
   },
   spacing: x => `${x * 8}px`,
});

let _debug = [];
let functions = {};
const modules = [
    "typography",
    "shadows",
    "spacing",
    "breakpoints",
    "palette",
    "shape",
];

for(let module of modules) {
   let functionSignature = `${module}($arguments...)`;
   functions[functionSignature] = (arg) => {
      let value;

      if (typeof(theme[module]) === "function") {
         let args = [];
         for(let i = 0; i < arg.getLength(); i++) {
            args.push(arg.getValue(i).getValue());
         }
         value = theme[module](...args);
         //console.log("IS FUNCTION", module);
      } else {
         let param = arg.getValue(0).getValue();
         let prop = "prop";
         value = muiSystem.style({
            prop,
            cssProperty: false,
            themeKey: module,
         })({theme, [prop]: param});
      }

      if (Array.isArray(value)) {
         let l = value.length;
         let list = new sass.types.List(l);
         value.forEach((v, i) => list.setValue(i, new sass.types.String(v.toString())));
         return list;
      } else if (typeof value === "object") {
         let entries = Object.entries(value);
         let l = entries.length;
         let map = new sass.types.Map(l);
         entries.forEach(([k, v], i) => {
            map.setKey(i, new sass.types.String(k.toString()));
            map.setValue(i, new sass.types.String(v.toString()));
         });
         return map;

      }
      _debug.push(value);

      return new sass.types.String(value.toString());
      //return value;
   };
}

/*functions[`breakpoints($arguments...)`] = (arg) => {
   let prop = "prop";
   let param = arg.getValue(0).getValue();
   let value = muiSystem.style({
      prop,
      cssProperty: false,
      themeKey: "breakpoints",
   })({theme, [prop]: param});

   _debug.push(["BREAKPOINTS", value]);
   return new sass.types.String("xx");
};*/

sass.render({
   file: "entry-specificity.scss",
   outputStyle: "compact",
   functions,
}, (error, result) => {
   //console.log("DEBUG", _debug);

   if (error) {
      console.error(error);
      process.exit(1);
   }

   fs.writeFileSync("output.css", result.css);
});