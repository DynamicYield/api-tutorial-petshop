const router = require('express').Router();
const createError = require('http-errors');
const productsModel = require('../models/product');

const PRODUCTS_PER_PAGE = 8;

router.get('/all', (req, res, next) => {
  const requestedPageParam = parseInt(req.query.page, 10) || 1;
  const requestedPage = requestedPageParam < 0 ? 1 : requestedPageParam;
  const result = productsModel.getAll(PRODUCTS_PER_PAGE, requestedPage);

  if (result.products.length === 0) {
    next(createError(404));
    return;
  }

  res.render('category', {
    title: 'Category',
    products: result.products,
    pagination: result.pagination,
  });
});

router.get('/*/', (req, res, next) => {
  const requestedPageParam = parseInt(req.query.page, 10) || 1;
  const requestedPage = requestedPageParam > 0 ? requestedPageParam : 1;
  const categoryName = req.params[0].replace(/\//g, '|').toLowerCase().replace(/\|$/, '');
  const result = productsModel.getCategory(categoryName, PRODUCTS_PER_PAGE, requestedPage);

  if (result.products.length === 0) {
    next(createError(404));
    return;
  }

  res.render('category', {
    title: 'Category',
    products: result.products,
    pagination: result.pagination,
  });
});

module.exports = router;
