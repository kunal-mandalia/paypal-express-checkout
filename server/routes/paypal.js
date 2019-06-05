const router = require('express').Router()
const paypal = require('../lib/paypal')

router.post('/checkout', async (req, res) => {
  try {
    const result = await paypal.setExpressCheckout()
    const redirectUri = `https://www.sandbox.paypal.com/webscr?cmd=_express-checkout&token=${result.TOKEN}`
    return res.redirect(307, redirectUri)
  } catch (e) {
    return res.status(500).json({ message1: e.message })
  }
})

router.get('/express-checkout-details', async (req, res) => {
  try {
    const { token } = req.query
    const expressCheckoutDetails = await paypal.getExpressCheckoutDetails(token)
    return res.status(200).json({ data: expressCheckoutDetails })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.post('/do-express-checkout-payment', async (req, res) => {
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

module.exports = router