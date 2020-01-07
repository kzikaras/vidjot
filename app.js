const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

// Map global promise (removes mongodb warning in console)
mongoose.Promise === global.Promise;

// Connect to mongoose Db
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));

//Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method override for allowing put requests from forms
app.use(methodOverride('_method'));

// Setup sessions middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// setup flash middleware
app.use(flash());

// How middleware works
app.use(function (req, res, next) {
    console.log(Date.now());
    next();
});

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('err');
    res.locals.user = req.user || null
    next();
})

// <-------------- All Routes below ------------------>

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome!'
    res.render('index', { title: title });
});

// Render About page
app.get('/about', (req, res) => {
    res.render('about');
});

// Use users routes
app.use('/users', users);

// Use ideas routes
app.use('/ideas', ideas);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});