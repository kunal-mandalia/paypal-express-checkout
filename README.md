# paypal-express-checkout
Demo of a variation of the paypal express checkout [flow](https://developer.paypal.com/docs/classic/express-checkout/ec_api_flow/)

## Development

1. Specify credentials for your merchant account in `.env` using `.env.example` as a reference.
2. Install dependencies `yarn`
3. Start server which also serves frontend `yarn dev`

You can test the following flows
* Classic express checkout (as per docs): `https://localhost:5000/classic/index.html`
* Custom (server integrated) checkout: `https://localhost:5000/custom/index.html`
