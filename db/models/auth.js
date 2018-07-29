const mongoose = require('mongoose');
//const db = require('/db.js')

const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String
});
const User = mongoose.model('userInfo', UserDetail, 'userInfo');

module.exports = User;
