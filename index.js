'use strict';

let express = require('express');
let bodyParser = require('body-parser')
let path = require('path');
let fs = require('fs');

let rest = require('./server/rest')
// let page = require('./server/page')

const port = 8001;
let app = express();

app.use(function(req,res,next){console.log(req.url);
    res.set('Access-Control-Allow-Origin','*');
    next();
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

app.use('/api/vi', rest)
app.use('/', express.static(path.join(__dirname, './client/')))

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);