// os module: gives info about system (built in)

const os = require("os")

// info about current user
const user = os.userInfo()
const currentOs = {
    name: os.type(),
    release: os.release(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
}

console.log(user)
console.log(currentOs)