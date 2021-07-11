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

//app.all('/',...) doesn't work.

// app.options('*', cors());
app.use(express.json({
    limit: "20MB"
}));

app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));

if (process.env.NODE_ENV === "development") {
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN = 'http://localhost:3000'
}

if (process.env.NODE_ENV === "production") {
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN = 'https://unsplash-clone-dh.netlify.app'
}

// base route 
app.get('/', (req, res) => {
    res.send(`Hello! ${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}`)
})
// Defining route middleware
app.use('/api', require('./routes/api'));
app.use('/users', require('./routes/users'))

console.log(process.env.ACCESS_CONTROL_ALLOW_ORIGIN)

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port} \n\n`);

module.exports = app;