//app/user/index.js

const express = require('express');
const router = express.Router();
const controller = require('./controller')



module.exports = function (passport) {
    router.get('/', controller.user);
    
    router.get('/login', (req, res) => {
        res.render('login');
    });
    router.get('/signup', (req, res) => {
        res.render('register');
    });
    
    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    /* Handle Logout */
    router.get('/signout', function (req, res) {
        console.log('logout');
        req.logout();
        res.redirect('/login');
    });
    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));
    return router;
}

//module.exports = router;
