// doesnt go line by line and block next command before completing previous

const { readFile, writeFile } = require("fs")

readFile(
    "./fodder/first.txt",
    "utf8",
    (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        const first = result
        readFile(
            "./fodder/second.txt",
            "utf8",
            (err, result) => {
                if (err) {
                    console.log(err)
                    return
                }
                const second = result

                writeFile (
                    "./fodder/writeFile.txt",
                    `Here is the result: ${first}, ${second}`,
                    (err, result) => {
                        if (err) {
                            console.log(err)
                            return
                        }

                        console.log(first, second)
                    }
                )

        })
})