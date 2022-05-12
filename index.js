import fs from 'fs';
import yml from "js-yaml";
import chalk from "chalk";
import run from "./run.js";
console.log(chalk.blue("setup..."));
let loc = process.argv.length > 2 ? process.argv[2] : "main.yml"
const script = fs.readFileSync(loc, 'utf8');
if(loc.endsWith(".json")){
    var file = JSON.parse(script);
}else{
    var file = yml.load(script);
}
console.log(chalk.blue("running..."));
run.run(file);
