const router = require('express').Router();
const products = require('../models/product');
const DYAPI = require('../DYAPI');

router.get('/', async (req, res) => {
  const { heroBanner, recommendationsArray, overlay } = await getPageContent(req);
  res.render('homepage', {
    overlay,
    heroBanner,
    recommendationsArray,
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


let campaigns = ['Women Shoes','Women Skirts','Women Accessories','Women Pants','Women Coats']
async function getPageContent(req) {
  req.dyContext.page.type = 'HOMEPAGE';
  const widgetDecision = await DYAPI.choose(req.userId, req.sessionId, req.dyContext, 
    ["Widgets Decision"]);
  
  console.log(widgetDecision['Widgets Decision']["widgets"])
  campaigns = widgetDecision['Widgets Decision']["widgets"].split(',');
  const apiResponse = await DYAPI.choose(req.userId, req.sessionId, req.dyContext, 
                                   campaigns);
  
  let recsArray = [];
  for ( let i in campaigns){
    recsArray.push(apiResponse[campaigns[i]]|| []);
  }
  const content = {
    recommendationsArray: recsArray,
  };
  console.log(content)
  return content;
}

module.exports = router;
