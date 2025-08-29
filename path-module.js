// path module : gives info about path of current folder etc.

const path = require("path")

console.log(path.sep) // separating symbol (different for each system)

const filepath = path.resolve("fodder","subfolder","text.txt") // joins folders in order
const base = path.basename(filepath) // smallest file/folder inside
const absolute = path.resolve(__dirname)

console.log(filepath)
console.log(base)
console.log(absolute)