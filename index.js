let express = require('express');
let path = require('path');

let rest = require('./server/rest')
let page = require('./server/page')
let app = express();
const port = 8001;

app.use(express.static(path.join(__dirname, '../')))
app.use('/api/vi', rest)
app.use('/page', page)

app.listen(port);