const express = require('express');
const logger  = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const mongoose = require('mongoose');
const bCrypt = require('bcrypt-nodejs');
var flash = require('req-flash');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public') ) );


//app.use(morgan('combined')); 
app.use(bodyParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

//mongoose.connect('mongodb://shibinragh1:password123@ds147391.mlab.com:47391/ask-questions');
//mongoose.connect('mongodb://shibinragh:password123@ds233571.mlab.com:33571/node-crud-express-mongo', { useNewUrlParser: true });

var dbConfig = require('./db/db.js');
var User = require('./db/models/auth.js');
mongoose.connect(dbConfig.url);




// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
app.use(expressSession({
    secret: 'mysecret'
}));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// passport/login.js
passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done) {
        // check in mongo if a user with username exists or not
        User.findOne({
                'username': username
            },
            function (err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Username does not exist, log error & redirect back
                if (!user) {
                    console.log('User Not Found with username ' + username);
                    return done(null, false);
                }
                // User exists but wrong password, log the error 
                if (!isValidPassword(user, password)) {
                    console.log('Invalid Password');
                    return done(null, false);
                }
                // User and password both match, return user from 
                // done method which will be treated like success
                return done(null, user);
            }
        );
    }));

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}


passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done) {
        findOrCreateUser = function () {
            // find a user in Mongo with provided username
            User.findOne({
                'username': username
            }, function (err, user) {
                // In case of any error return
                if (err) {
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                }
                // already exists
                if (user) {
                    console.log('User already exists');
                    return done(null, false);
                } else {
                    console.log(username);
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();
                    // set the user's local credentials
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.email = req.param('email');
                    newUser.firstName = req.param('firstName');
                    newUser.lastName = req.param('lastName');
                    console.log(newUser);
                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, newUser);
                    });
                }
            });
        };

        // Delay the execution of findOrCreateUser and execute 
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    }));

// Generates hash using bCrypt
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
console.log('test');
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

/* Handle Registration POST */
app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
}));
/* Handle Logout */
app.get('/signout', function(req, res) {
  console.log('logout');
  req.logout();
  res.redirect('/login');
});
/* Handle Login POST */
app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));




app.get('/', isLoggedIn, (req, res) => {
    res.render('index');
});
app.get('/home', (req, res) => { 
    res.render('home');
});
app.get('/login', (req, res) =>{
    res.render('login');
});
app.get('/signup', (req, res) =>{
    res.render('register');
});
app.post('/go', (req, res) => {
    console.log('goo' + req.body.name);
});
app.get('/go', (req, res) => {
    res.status(404).send("Oh uh, something went wrong");
});


app.listen(3000, function(){
    console.log('port 3000');
})