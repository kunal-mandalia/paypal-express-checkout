require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
const https = require('https')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const paypal = require('./lib/paypal')
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.get('/status', (req, res) => {
  return res.status(200).json({ status: 200 })
})

app.post('/checkout', async (req, res) => {
  try {
    const result = await paypal.setExpressCheckout()
    const redirectUri = `https://www.sandbox.paypal.com/webscr?cmd=_express-checkout&token=${result.TOKEN}`
    return res.redirect(307, redirectUri)
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
})

app.get('/express-checkout-details', async (req, res) => {
  try {
    const { token } = req.query
    const expressCheckoutDetails = await paypal.getExpressCheckoutDetails(token)
    return res.status(200).json({ data: expressCheckoutDetails })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

app.post('/do-express-checkout-payment', async (req, res) => {
  try {
    const { token, PayerID } = req.body
    console.log(req.body)
    const paymentResponse = await paypal.doExpressCheckoutPayment(token, PayerID)
    return res.status(200).json({ data: paymentResponse })
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ message: error.message })
  }
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