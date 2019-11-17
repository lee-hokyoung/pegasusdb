const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const passport = require('passport');
const passportConfig = require('./config/passport');
const app = express();

require('./passport.js');

const connect = require('./model');
// const passportConfig = require('./passport');
// passportConfig(passport);
connect();


const homeRoute = require('./router/home');
const authRoute = require('./router/auth');
const detailRoute = require('./router/detail');
const adminRoute = require('./router/admin');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/chart.js', express.static(path.join(__dirname, 'node_modules/chart.js/dist')));
app.use('/bootstrap-select', express.static(path.join(__dirname, 'node_modules/bootstrap-select/dist')));
app.use(passport.initialize());
passportConfig();

// app.use(session({
//   resave:true,
//   saveUninitialized:false,
//   secret:process.env.COOKIE_SECRET,
//   cookie:{
//     httpOnly:true,
//     secure:false
//   }
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/', passport.authenticate('jwt', {session:false}), homeRoute);
app.use('/', homeRoute);
app.use('/auth', authRoute);
app.use('/detail', detailRoute);
app.use('/admin', adminRoute);

app.listen(process.env.PORT, ()=>{console.log(process.env.PORT, ' port has started')});