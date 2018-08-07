// /app.js

const express = require('express');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const mongoose = require('mongoose');
const bCrypt = require('bcrypt-nodejs');
var flash = require('req-flash');
 

const shared = require('./app/shared/auth.services'); 

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


//app.use(morgan('combined')); 
app.use(bodyParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());


var dbConfig = require('./db/db.js');
//var User = require('./db/models/auth.js');
var Quotes = require('./db/models/quotes.js');
mongoose.connect(dbConfig.url);
var db = mongoose.connection;



// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
//const LocalStrategy = require('passport-local').Strategy;
app.use(expressSession({
    secret: 'mysecret'
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

const root = require('./app/index')(passport);  
app.use('/root', root);









// route middleware to make sure a user is logged in
/*function isLoggedIn(req, res, next) {
    console.log('test');
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}*/

var data; 

app.put('/test', (req, res) =>{
    var quotes =  new Quotes(req.body);
    quotes.save(function(err, result){
        console.log(result);
    });
     
})

app.post('/ask-question', (req, res) => {
    console.log(data._id);

    User.findOneAndUpdate({
        _id: data._id
    }, {
        $set: {
            "posts": [{
                "post": {
                    "article": req.body.description
                }
            }]
        }
    });
 

});

app.get('/', shared.isLoggedIn, (req, res) => {
    data = req.user;
    res.render('index');
});
app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('register');
});
app.get('/ask-question', shared.isLoggedIn, (req, res) => {
    res.render('ask-question', {
        data: data.username
    })
});
app.get('/go', (req, res) => {
    res.status(404).send("Oh uh, something went wrong");
});



app.listen(3000, function () {
    console.log('port 3000');
})

module.exports = app;
