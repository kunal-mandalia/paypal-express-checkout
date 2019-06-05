const route = require('express').Router()
const paypal = require('../lib/paypal')

function getCartId () {
  return Math.floor(Math.random() * 1000)
}

const db = {
  carts: {}
}

route.post('/create-cart', async (req, res) => {
  try {
    const { TOKEN } = await paypal.setExpressCheckout()

    // store token in 'db' for later checkout access
    const cartId = getCartId()
    db.carts[cartId] = TOKEN

    return res.status(200).json({
      cartId,
      token: TOKEN
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

route.post('/checkout', async (req, res) => {
  try {
    const { cartId, PayerID } = req.body
    console.log("cartId, PayerID", cartId, PayerID)
    
    if (!cartId || !db.carts[cartId]) {
      return res.status(400).json({ message: 'bad cartId' })
    }

    if (!PayerID) {
      return res.status(400).json({ message: 'bad PayerID' })
    }

    const token = db.carts[cartId]
    const paymentResponse = await paypal.doExpressCheckoutPayment(token, PayerID)
    console.log('paymentResponse', paymentResponse)

    // clear token from db?
    return res.status(200).json({ data: paymentResponse })
  } catch (error) {
    console.log('checkout error', error)
    return res.status(500).json({ message: error.message })
  }
})

module.exports = route