const express = require('express'); // express framework 
const bodyParser = require('body-parser'); // url manuplation
const cors = require('cors'); // security for browser

const app = express();

app.use(bodyParser.json());
app.use(cors());


const comments = require('./routes/api/comments'); // import comments api from backend
const accounts = require('./routes/api/accounts');
const sections = require('./routes/api/sections');

app.use('/api/accounts', accounts); // use comments api
app.use('/api/comments', comments);
app.use('/api/sections', sections);

const port = 5000;

app.listen(port, console.log("connected."))

