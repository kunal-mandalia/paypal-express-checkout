window.paypalCheckoutReady = function () {
  paypal.checkout.setup('AcCajkQxi9sWNJ2oLpHO335qbzJc0Jxvi_N7l82jCveRgk7LhHnUYPt9OQ8IrUNzoAuf12xRPVZz1OY0', {
      environment: 'sandbox',
      container: 'myContainer'
    });
};