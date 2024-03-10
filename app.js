require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jsend = require('jsend');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
require('./passport-config');

const db = require("./models");
db.sequelize.sync({ force: false });

const app = express();

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

// flash messages middleware
app.use(flash());

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(jsend.middleware);

// swagger UI setup
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// require route handlers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const brandsRouter = require('./routes/brands');
const cartRouter = require('./routes/cart');
const categoryRouter = require('./routes/category');
const initRouter = require('./routes/init');
const productsRouter = require('./routes/products');
const membershipRouter = require('./routes/membership');
const searchRouter = require('./routes/search');

// front end routes
const adminProductsRouter = require('./routes/admin/products');
const adminBrandsRouter = require('./routes/admin/brands');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminRolesRouter = require('./routes/admin/roles');
const adminUsersRouter = require('./routes/admin/users');
const adminOrdersRouter = require('./routes/admin/orders');
const loginLogoutRoutes = require('./routes/admin/loginLogout');

// use routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/brands', brandsRouter);
app.use('/cart', cartRouter);
app.use('/category', categoryRouter);
app.use('/init', initRouter);
app.use('/products', productsRouter);
app.use('/membership', membershipRouter);
app.use('/search', searchRouter);

// use front end routes
app.use('/admin/products', adminProductsRouter);
app.use('/admin/brands', adminBrandsRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/roles', adminRolesRouter);
app.use('/admin/users', adminUsersRouter);
app.use('/admin/orders', adminOrdersRouter);
app.use('/admin/loginLogout', loginLogoutRoutes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
