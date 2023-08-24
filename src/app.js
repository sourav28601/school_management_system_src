require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const web = require('./routes/web');
const path = require('path');
var flash = require('connect-flash');
var session = require('express-session');
require('./db/connectiondb');
// require('./models/index');
// console.log("hey jon");

app.get('/test', (req, res) => {
  res.send('hey john')
})
const cookieParser = require('cookie-parser')
var cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(cookieParser())
// Middleware
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}))

app.use(flash());

// router load
app.use('/admin', web)

// ejs template
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// // public folder setup
app.use("/public", express.static(__dirname + "/public/"));


module.exports = app