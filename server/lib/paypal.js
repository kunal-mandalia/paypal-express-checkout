const axios = require("axios")
const qs = require("qs")
const querystring = require('querystring')

const {
  PAYPAL_NPV_ENDPOINT,
  PAYPAL_MERCHANT_USERNAME,
  PAYPAL_MERCHANT_PASSWORD,
  PAYPAL_MERCHANT_SIGNATURE,
  PAYPAL_REDIRECT_URL,
  PALPAL_CANCEL_URL,
  PAYPAL_API_VERSION
} = process.env

const endpointNVP = PAYPAL_NPV_ENDPOINT || "https://api-3t.sandbox.paypal.com/nvp"
const username = PAYPAL_MERCHANT_USERNAME
const password = PAYPAL_MERCHANT_PASSWORD
const signature = PAYPAL_MERCHANT_SIGNATURE
const returnUrl = PAYPAL_REDIRECT_URL || "https://localhost:5000/confirm-order.html/"
const cancelUrl = PALPAL_CANCEL_URL || "https://localhost:5000/cancelled-order.html/"
const apiVersion = PAYPAL_API_VERSION || 78

async function buildPaypalRequest(body) {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        headers: {
          "Content-Type": "x-www-form-urlencoded",
          "Accept": "text/plain; charset=utf-8"
        }
      }
      const credentials = {
        USER:username,
        PWD:password,
        SIGNATURE:signature
      }
      const formBody = {
        ...credentials,
        ...body
      }
      const response = await axios.post(endpointNVP, qs.stringify(formBody), options)
      const decodedResponse = querystring.decode(response.data)

      if (decodedResponse.ACK !== "Success") {
        return reject(decodedResponse)
      }
      return resolve(decodedResponse)
    } catch (error) {
      return reject(error)
    }
  })
}

async function setExpressCheckout() {
  return buildPaypalRequest({
    METHOD:"SetExpressCheckout",
    VERSION: apiVersion,
    PAYMENTREQUEST_0_PAYMENTACTION:"SALE",
    PAYMENTREQUEST_0_AMT:19.95,
    PAYMENTREQUEST_0_CURRENCYCODE:"GBP",
    cancelUrl: cancelUrl,
    returnUrl: returnUrl
  })
}

async function getExpressCheckoutDetails(token) {
  return buildPaypalRequest({
    METHOD:"GetExpressCheckoutDetails",
    VERSION: apiVersion,
    TOKEN: token
  })
}

async function doExpressCheckoutPayment(token, payerId) {
  return buildPaypalRequest({
    METHOD:"DoExpressCheckoutPayment",
    VERSION: apiVersion,
    TOKEN: token,
    PAYERID: payerId,
    PAYMENTREQUEST_0_PAYMENTACTION:"SALE",
    PAYMENTREQUEST_0_AMT:19.95,
    PAYMENTREQUEST_0_CURRENCYCODE:"GBP"
  })
}

module.exports = {
  setExpressCheckout,
  getExpressCheckoutDetails,
  doExpressCheckoutPayment
}