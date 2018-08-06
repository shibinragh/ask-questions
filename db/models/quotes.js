const mongoose = require('mongoose');
//const db = require('/db.js')

const Schema = mongoose.Schema;
const quotesVa = new Schema({
    title: String,
    description: String
});
const Quotes = mongoose.model('quotes', quotesVa, 'quotes');

module.exports = Quotes;
