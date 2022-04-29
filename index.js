import fs from 'fs';
import yml from "js-yaml";
import chalk from "chalk";
import run from "./run.js";
console.log(chalk.blue("setup..."))
let loc = process.argv.length > 2 ? process.argv[2] : "main.yml"
const script = fs.readFileSync(loc, 'utf8');
var file = yml.load(script);
let cur;
console.log(chalk.blue("running..."))
run.run(file)