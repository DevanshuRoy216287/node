// read and write files using fs module (built-in)
const { readFileSync, writeFileSync, } = require("fs")

// read content inside file
const first = readFileSync("./fodder/first.txt", "utf8")
const second = readFileSync("./fodder/second.txt", "utf8")

console.log(first, second)

writeFileSync(
    "./fodder/writFileSync.txt",
    "I just wrote this file with write File Sync"
)

writeFileSync(
    "./fodder/append.txt",
    "Im gonna append this everytime",
    {flag: "a"} // adds the same content everytime
)