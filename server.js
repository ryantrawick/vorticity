const http = require('http')
const express = require('express')
const path = require('path')

const publicPath = path.join(__dirname, './public')
const assetsPath = path.join(__dirname, './assets')
const port = process.env.PORT || 3000
const app = express()

const server = http.createServer(app)

app.use(express.static(publicPath))
app.use('/assets', express.static(assetsPath))

server.listen(port, () => {
  console.log(`server started on port ${port}`)
})
