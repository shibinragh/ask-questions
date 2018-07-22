const express = require('express');
var morgan  = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(morgan('combined')); 
app.use(bodyParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public') ) );

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/home', (req, res) => { 
    res.render('home');
});
app.post('/go', (req, res) => {
    console.log('goo' + req.body.name);
});
app.post('/', function(req, res){
    console.log(req.body.name);
    console.log(req.body.email);
});
app.listen(3000, function(){
    console.log('port 3000');
})