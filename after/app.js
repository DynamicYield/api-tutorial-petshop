const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const uuidv4 = require('uuid/v4');
const homepageRouter = require('./routes/homepage');
const productsRouter = require('./routes/product');
const cateogryRouter = require('./routes/category');
const cartRouter = require('./routes/cart');
const reportClickRouter = require('./routes/reportClick');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** userId management */

app.use((req, res, next) => {
  let { userId } = req.cookies;
  if (!userId) {
    userId = uuidv4();
    res.cookie('userId', userId, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
  }
  req.userId = userId;
  next();
});

/** session management */

app.use(cookieSession({
  name: 'session',
  secret: 'somesecretkeyhash',
}));

app.use((req, _res, next) => {
  if (req.session.isNew) { // cookieSession defines what is considered a new session
    req.session.sessionId = uuidv4();
  }
  req.sessionId = req.session.sessionId;
  // for the sake of simplicity the cart is stored in the session as well
  req.cart = req.session.cart || { total: 0, products: [] };
  req.session.cart = req.cart;
  next();
});

/** add dyContext */
app.use((req, _res, next) => {
  req.dyContext = {
    page: {
      location: `${req.protocol}://${req.hostname}${req.originalUrl}`,
      referrer: req.headers.referer || '',
      data: [],
    },
    device: {
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip,
    },
    pageAttributes: req.query,
  };
  next();
});

app.use('/', homepageRouter);
app.use('/product', productsRouter);
app.use('/category', cateogryRouter);
app.use('/cart', cartRouter);
app.use('/reportClick', reportClickRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : null;

  res.status(err.status || 500);
  res.render('error');
  next();
});

module.exports = app;
