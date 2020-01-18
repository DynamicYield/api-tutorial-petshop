const router = require('express').Router();
const createError = require('http-errors');
const products = require('../models/product');
const DYAPI = require('../DYAPI');

router.get('/:sku', async (req, res, next) => {
  const { sku } = req.params;

  const product = products.getProduct(sku);
  if (product.length === 0) {
    next(createError(404));
    return;
  }

  const currentProduct = product[0];

  const recommendations = products.getCategory(currentProduct.categories, 5, 1)
    .products.filter(_product => _product.sku !== sku)
    .slice(0, 4);

  res.render('product', {
    product: currentProduct,
    recommendations,
  });
});

router.post('/add', (req, res) => {
  const { sku, qty, price } = req.body;
  const addedProduct = products.getProduct(sku);

  if (addedProduct.length === 0) {
    res.status(404).json({ success: false });
    return;
  }

  /** add the item to the cart. cart is stored in the req.session cookie */
  const { cart } = req.session;
  const cartProducts = cart.products;
  const search = cartProducts.filter(item => item.sku === sku);
  if (search.length > 0) {
    cartProducts[cartProducts.indexOf(search[0])].qty = cartProducts[cartProducts.indexOf(search[0])].qty + qty;
  } else {
    cartProducts.push({ sku, qty, price });
  }

  req.session.cart.total = cartProducts.reduce((acc, product) => acc + (product.price * product.qty), 0);

  const addToCartEvent = {
    name: 'Add to Cart',
    properties: {
      dyType: 'add-to-cart-v1',
      value: price,
      productId: sku,
      quantity: qty,
    }
  };

  DYAPI.reportEvent(req.userId, req.sessionId, addToCartEvent);

  res.json({
    success: true,
    itemsInCart: req.session.cart.products.reduce((acc, product) => acc + product.qty, 0),
    total: req.session.cart.total.toFixed(2),
  });
});


module.exports = router;
