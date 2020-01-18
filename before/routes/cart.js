const router = require('express').Router();
const products = require('../models/product');

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
  req.session.cart = { total: 0, products: [] }; // reset cart
  res.render('purchased', {});
});

module.exports = router;
