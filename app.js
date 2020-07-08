//third-party module
const path = require('path');
const express = require('express'); //third party module
const bodyParser = require('body-parser'); //third party module to extract data from body
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// const expressHbs = require('express-handlebars');

const app = express();

//handlebars is not built-in so need to register engine
// app.engine(
//   'hbs',
//   expressHbs({
//     layoutsDir: 'views/layout/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs',
//   })
// );

// app.set('view engine', 'hbs'); //using handlebars
// app.set('view engine', 'pug'); //using pug templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //serve static files (e.g. css, images)

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//request goes from top to bottom

//allows us to add a new middleware function
// app.use((req, res, next) => {
//   console.log('in the middleware');
//   next(); //allows the request to continue to the next middleware in line
// });

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  //.sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
