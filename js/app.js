const http = require('http')

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        res.end('Hello, World!')
    }
    if (req.url == '/about') {
        res.end('About Page')
    } else {
        res.end(`
        <h1>Oops! ERROR</h1>
        <a href="/">Home</a>
        `)
    }
})

server.listen(5000)
