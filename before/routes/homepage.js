const router = require('express').Router();
const products = require('../models/product');

router.get('/', async (req, res) => {
  const { heroBanner, recommendations, overlay } = await getPageContent(req);
  res.render('homepage', {
    overlay,
    heroBanner,
    recommendations,
    invertedHeader: true,
  });
});

const defaultHeroBanner = {
  image: 'http://cdn.dynamicyield.com/petshop/images/pets-3715733_1920.jpg',
  title: 'We got your pet.',
  subtitle: 'Lorem ipsum dolor sit amet, consectetur<br>adipiscing elit. Etiam fringilla lorem eget lacus',
  cta: 'Go Shopping',
  link: '/category/all',
};

const defaultRecommendations = products.getRandom(4);

const defaultOverlay = {
  image: 'http://cdn.dynamicyield.com/petshop/images/erda-estremera-581452-unsplash.png',
  title: 'Invest in your pet',
  content: 'Subscribe to our monthly treat box<br>and receive the items you love for a<br>great price, plus seasonal surprises',
  cta: 'Start Here',
  link: '/category/all',
};

async function getPageContent(req) {
  const content = {
    heroBanner: defaultHeroBanner,
    recommendations: defaultRecommendations,
  };
  
  if (req.originalUrl.includes('SALE')) {
    content.overlay = defaultOverlay;
  }
  return content;
}

module.exports = router;
