//app/home/index.js

const express = require('express');
const router = express.Router(); 
const controller = require('./controller')




router.get('/', controller.home);


module.exports = router;

