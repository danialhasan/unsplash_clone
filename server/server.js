// Importing required modules
const cors = require('cors');
const express = require('express');

// parse env variables
require('dotenv').config();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// cors middleware
// app.use(cors())

app.all('/', (req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'https://unsplash-clone-dh.netlify.app');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")

    next()
})

// app.options('*', cors());
app.use(express.json({
    limit: "20MB"
}));

app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));

// Defining route middleware
app.use('/api', require('./routes/api'));
app.use('/users', require('./routes/users'))

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port} \n\n`);

module.exports = app;