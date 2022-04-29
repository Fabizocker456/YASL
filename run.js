import fs from "fs"
import chalk from "chalk"

var wait = (s) => {
  let now = new Date()
  while (new Date() - now < 1000 * s) { }
}
var funcs = {
  "wait": a => wait(a.a[0]),
  "print": a => { console.log(chalk.yellow(a.a.join(''))); return a.a.join('') },
  "raw": a => (a.a[0]),
  "math": a => {
    let args = a.a.map(i => i)
    let op = args.shift();
    let rs
    if (op == "+") { rs = args[0] + args[1] }
    else if (op == "-") { rs = args[0] - args[1] }
    else if (op == "*") { rs = args[0] * args[1] }
    else if (op == "/") { rs = args[0] / args[1] }

    else if (op == "%") { rs = args[0] % args[1] }
    else if (op == "**") { rs = args[0] ** args[1] }

    else if (op == "min") { rs = Math.min(...args) }
    else if (op == "max") { rs = Math.max(...args) }

    else if (op == "inv") { rs = 1 / args[0] }
    else if (op == "neg") { rs = 0 - args[0] }

    else if (op == "pi") { rs = Math.PI }
    else if (op == "e") { rs = Math.E }

    else if (op == "sin") { rs = Math.sin(args[0] / 180 * Math.PI) }
    else if (op == "cos") { rs = Math.cos(args[0] / 180 * Math.PI) }
    else if (op == "tan") { rs = Math.tan(args[0] / 180 * Math.PI) }
    return rs
  },
  "logic": a => {
    let args = a.a.map(a => a)
    let op = args.shift()
    let rs
    if (op == "==") { rs = args[0] == args[1] }
    else if (op == ">") { rs = args[0] > args[1] }
    else if (op == "<") { rs = args[0] < args[1] }
    else if (op == "!!") { rs = !args[0] }

    else if (op == "||") { rs = args[0] || args[1] }
    else if (op == "&&") { rs = args[0] && args[1] }
    else if (op == "&|") { rs = !args[0] != !args[1] }

    else if(op == "!") { rs = ~args[0] }
    else if (op == "|") { rs = args[0] | args[1] }
    else if (op == "&") { rs = args[0] & args[1] }
    else if (op == "^") { rs = args[0] ^ args[1] }
    return rs
  },
  "get": a => { return a.w[a.a[0]] },
  "set": a => { a.w[a.a[0]] = a.a[1]; return a.a[1] },
  "read": a => (fs.readFileSync(a.a.join(""))),
  "write": a => (fs.writeFileSync(a.a[0], a.a.slice(1).join("")))
}


var cffuncs = {
  "if": a => {
    if(run(a.c["if"])){
      if(Object.keys(a.c).includes("do")){
        return run(a.c["do"])
      } else { return null } }
    else { 
      if (Object.keys(a.c).includes("else")) {
        return run(a.c["else"]) 
      } else { return null } }
  },
  "for": a => {
    run(a.c["for"][0])
    let repeat = true
    while (1) {
      repeat = run(a.c["for"][1])
      if (repeat) { } else { return }
      run(a.c["do"])
      run(a.c["for"][2])
    }
  }

}

var world = {}

function run(code) {
  if (Array.isArray(code)) {return code.map(run)}
  if (typeof code != "object") { return code }
  code = JSON.parse(JSON.stringify(code))
  code["args"] = Object.keys(code).includes("args") ? run(code["args"]) : []
  if (Object.keys(funcs).includes(code["action"])) {
    return funcs[code["action"]]({ a: code["args"], c: code, w:world })
  } else if (Object.keys(cffuncs).includes(code["action"])) {
    return cffuncs[code["action"]]({ a: code["args"], c: code, w: world })
  }
}

export default {
  "run": run
}
