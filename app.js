const express = require("express");
const Router = require("./routs/viewRout");
const User = require("./routs/user-rout");
const doctor = require("./routs/doctor-rout");
const patient = require("./routs/patient-rout");
const book = require("./routs/book-rout");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const flash = require("connect-flash");
const session = require("express-session");
const expressLayout = require("express-ejs-layouts");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET,
    cookie: { maxAge: 600 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayout);
app.set("view engine", "ejs");
app.use(morgan("dev"));

app.use("/", Router);
app.use("/", User);
app.use("/", doctor);
app.use("/", patient);
app.use("/", book);

module.exports = app;
