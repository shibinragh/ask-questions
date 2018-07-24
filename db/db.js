const mongoose = require('mongoose');

var db;
mongoose.connect('mongodb://shibinragh:password123@ds147391.mlab.com:47391/ask-qusestions');
var db = mongoose.connection;