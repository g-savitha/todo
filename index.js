const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

//DB Config
const db = require('./config/db');
//connect to DB
//mongoose.connect(db.mongoURI, {useNewUrlParser: true}).then(() => console.log('MongoDB Connected!')).catch(err => console.log(err));
mongoose.connect(db.mongoURI,{useNewUrlParser: true}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.log(err);
});

//link Route files
const todo = require('./routes/todo');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);



//BodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Method-override
app.use(methodOverride('_method'));

//Express session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));

//Passportjs Middleware

app.use(passport.initialize());
app.use(passport.session());


//connect-flash  

app.use(flash());

//Gloabal Variables

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Route requests
app.get('/', (req, res) => {
    const title = "Todo App";
    res.render('index', {
        title: title
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

//use routes
app.use('/todo', todo);
app.use('/users', users);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
