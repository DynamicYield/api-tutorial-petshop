const products = require('../feed/products.json');

function getCategory(category, itemsPerPage, page = 1) {
  const items = products.filter(item => item.categories.toLowerCase().indexOf(category.toLowerCase()) > -1);
  const maxPage = (Math.ceil(items.length / itemsPerPage) - 1);

  const result = {
    products: items.slice(itemsPerPage * (page - 1), itemsPerPage * page),
    pagination: {
      currentPage: page,
      category: category.replace(/\|/g, '/'),
    },
  };

  if (page > 1) {
    result.pagination.prev = page - 1;
  }

  if (page <= maxPage) {
    result.pagination.next = page + 1;
  }

  return result;
}

function getProducts(skus) {
  return products.filter(item => skus.indexOf(item.sku) > -1);
}

function getProduct(sku) {
  return products.filter(item => item.sku.toString() === sku.toString());
}

function getAll(itemsPerPage, page) {
  const maxPage = (Math.ceil(products.length / itemsPerPage) - 1);

  const result = {
    products: products.slice(itemsPerPage * (page - 1), itemsPerPage * page),
    pagination: {
      currentPage: page,
      category: 'all',
    },
  };

  if (page > 1) {
    result.pagination.prev = page - 1;
  }

  if (page <= maxPage) {
    result.pagination.next = page + 1;
  }

  return result;
}

function getRandom(items) {
  const total = items < products.length ? items : products.length;
  const result = [];
  let currentIndex = 0;

  while (currentIndex < total) {
    const product = products[Math.floor(Math.random() * products.length)];
    if (result.indexOf(product) === -1) {
      result.push(product);
      currentIndex += 1;
    }
  }

  return result;
}

module.exports = {
  getAll,
  getProduct,
  getProducts,
  getCategory,
  getRandom,
};
