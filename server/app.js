require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
const https = require('https')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const { paypal, bff } = require('./routes')

const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use('/paypal', paypal)
app.use('/bff', bff)

app.get('/status', (req, res) => {
  return res.status(200).json({ status: 200 })
})

app.use(express.static(path.join(__dirname, "..", "client"), { redirect: false }))

https.createServer({
  key: fs.readFileSync("./server/key.pem"),
  cert: fs.readFileSync('./server/cert.pem'),
  passphrase: 'helloworld'
}, app)
.listen(port, async () => {
  console.log(`https server listening on ${port}`)
})