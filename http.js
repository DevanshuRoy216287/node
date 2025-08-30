// create server

const http = require("http")

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.end("This is home page gng")
        return
    }
    if (req.url === "/about") {
        res.end("why do u wanna know about me?")
        return
    }

    res.end(`
        <h1>Oops!</h1>
        <p>Wrong page bro</p>
    `)
})

server.listen(5000)