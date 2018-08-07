//app/index.js

const express = require('express');
const router = express.Router(); 
const home = require('./home/index');
const user = require('./users/index');


 module.exports = function (passport) {

//express.Router()
//router.use('/home', home); 
router.use('/user', user); 
     return router;
 }
//module.exports = router; 