const fs = require("fs");
const path = require("path");
const utils = require("./utils");

const compspath = process.argv[2];
if (!compspath)
  throw new Error("No compositions path provided");
const comps = JSON.parse(fs.readFileSync(compspath, "utf8"))

const semspath = path.dirname(compspath);
const sems = {}
for (const file of utils.readdirRecursive(semspath).filter(f => f.endsWith(".json"))) {
  const val = JSON.parse(fs.readFileSync(file, "utf8"))
  utils.mergeDeep(sems, val)
}

const usedSemsInCompos = Array.from(new Set(JSON.stringify(comps).match(/\{sem.*?\}/gmi)))
for (const sem of usedSemsInCompos) {
  const name = sem.match(/\{(.*)\}/)[1]
  const semValue = utils.get(sems, name)
  if (!semValue) {
    utils.set(comps, name, {value: '', type: ''})
    utils.log('Created', utils.yellow(name))
  }
}

fs.writeFileSync(compspath, JSON.stringify(comps, null, 2), "utf8")