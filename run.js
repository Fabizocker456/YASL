import fs from "fs"

var funcs = {
"print":a=>{console.log(a.a.join(''));return a.a.join('')},
"raw":a=>(a.a[0]),
"math":a=>{
    let op = a.a[0]
    let args=a.a.slice(1)
    /**/ if(op=="sum"){return args[0] + args[1]}
    else if(op=="sub"){return args[0] - args[1]}
    else if(op=="mul"){return args[0] * args[1]}
    else if(op=="div"){return args[0] / args[1]}

    else if(op=="mod"){return args[0] % args[1]}
    else if(op=="exp"){return args[0] ** args[1]}

    else if(op=="min"){return Math.min(...args)}
    else if(op=="max"){return Math.max(...args)}

    else if(op=="inv"){return 1 / args[0]}
    else if(op=="neg"){return 0 - args[0]}

    else if(op=="pi"){return Math.PI}
    else if(op=="e"){return Math.E}

    else if(op=="sin"){return Math.sin(args[0]/180*Math.PI)}
    else if(op=="cos"){return Math.cos(args[0]/180*Math.PI)}
    else if(op=="tan"){return Math.tan(args[0]/180*Math.PI)}
  },
"get":a=>(Object.keys(a.w).includes(a.a[0]) ? a.w[a.a[0]] : null),
"set":a=>{a.w[a.a[0]]=a.a[1];return a.a[1]},
"read":a=>(fs.readFileSync(a.a.join(""))),
"write":a=>(fs.writeFileSync(a.a[0],a.a.slice(1).join("")))
}

var cffuncs = {

}

var world = {}

function run(code){
  if(!Object.keys(code).includes("action")){return code}
  if(Array.isArray(code)){return code.map(run)}
  if(Object.keys(funcs).includes(code["action"])){
    code["args"]= Object.keys(code).includes("args")?run(code["args"]):[]
    return funcs[code["action"]]({a:code["args"],w:world,c:code})
  } else if (Object.keys(cffuncs).includes(code["action"])){
    return cffuncs[code["action"]]({a:code})
  }
}

export default {
    "run":run
}
