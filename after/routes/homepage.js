const router = require('express').Router();
const products = require('../models/product');
const DYAPI = require('../DYAPI');

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
  req.dyContext.page.type = 'HOMEPAGE';
  const apiResponse = await DYAPI.choose(req.userId, req.sessionId, req.dyContext, 
                                    ['HP Hero Banner', 'HP Recommendations', 'HP Overlays']);
  const content = {
    heroBanner: apiResponse['HP Hero Banner'] || defaultHeroBanner,
    recommendations: apiResponse['HP Recommendations'] || defaultRecommendations,
    overlay: apiResponse['HP Overlay'],
  };
  return content;
}

module.exports = router;
