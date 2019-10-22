const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const homeRoute = require('./router/home');
const authRoute = require('./router/auth');
const detailRoute = require('./router/detail');
const adminRoute = require('./router/admin');

const connect = require('./model');
connect();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/chart.js', express.static(path.join(__dirname, 'node_modules/chart.js/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));

app.use('/', homeRoute);
app.use('/auth', authRoute);
app.use('/detail', detailRoute);
app.use('/admin', adminRoute);

app.listen(process.env.PORT, ()=>{console.log(process.env.PORT, ' port has started')});