const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const MongoStore = require("connect-mongo")(session);

const homeRoute = require("./router/home");
const authRoute = require("./router/auth");
const detailRoute = require("./router/detail");
const adminRoute = require("./router/admin");
const excelRoute = require("./router/excel");
const sessionRoute = require("./router/session");
const middle = require("./router/middlewares");

// require('./passport.js');
const connect = require("./model");
const passportConfig = require("./passport");

const app = express();
passportConfig(passport);
connect();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  "/chart.js",
  express.static(path.join(__dirname, "node_modules/chart.js/dist"), { expires: "30d" })
);
// app.use('/bootstrap-select', express.static(path.join(__dirname, 'node_modules/bootstrap-select/dist'), {expires:'30d'}));
app.use("/downloads", express.static(path.join(__dirname, "downloads"), { expires: "30d" }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: process.env.MONGO_URI,
      collection: "session",
    }),
    cookie: { secure: false, httpOnly: true, expires: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", homeRoute);
app.use("/auth", authRoute);
app.use("/detail", detailRoute);
app.use("/admin", middle.isAdmin, adminRoute);
app.use("/session", sessionRoute);
app.use("/excel", excelRoute);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, " port has started");
});
