const router = require('express').Router();
const products = require('../models/product');
const DYAPI = require('./../DYAPI');

router.get('/', (req, res) => {
  const skus = req.session.cart.products.map(item => item.sku);
  const cartProducts = products.getProducts(skus).map((item) => {
    const { qty } = req.session.cart.products.filter(cItem => cItem.sku === item.sku)[0];
    return {...item, qty};
  });
  const total = req.session.cart.total;
  res.render('cart', {
    products: cartProducts,
    cartValue: total
  });
});

router.get('/purchase', async (req, res) => {
  const { cart } = req.session;

  if (cart.total > 0) {
    const purchaseEvent = {
      name: 'Purchase',
      properties: {
        dyType: 'purchase-v1',
        value: cart.total,
        cart: cart.products.map(item => ({
          productId: item.sku,
          quantity: item.qty,
          itemPrice: parseFloat(item.price),
        })),
      },
    };

    DYAPI.reportEvent(req.userId, req.sessionId, purchaseEvent);
  }

  req.session.cart = { total: 0, products: [] }; // reset cart
  res.render('purchased', {});
});

module.exports = router;
