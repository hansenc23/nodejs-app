//third-party module
const path = require('path');
const express = require('express'); //third party module
const bodyParser = require('body-parser'); //third party module to extract data from body
const errorController = require('./controllers/error');

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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//request goes from top to bottom

//allows us to add a new middleware function
// app.use((req, res, next) => {
//   console.log('in the middleware');
//   next(); //allows the request to continue to the next middleware in line
// });

app.use(errorController.get404);

app.listen(5000);
