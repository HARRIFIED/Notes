require('dotenv').config();
require("./server/config/db")();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");


const app = express();
const port = 5000 || process.env.PORT;
app.use(session({
    secret: 'Hello World',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    })
}));


//Middlewwares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Template
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs')

//routing
app.use('/', require('./server/routes/auth'))
app.use('/', require('./server/routes/index'))
app.use('/', require('./server/routes/dashboard'))

//Page not found
app.use("*", (req, res) => {
    try {
        return res.redirect("/")
    } catch (err) {
        return res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`server running at port ${port}`)
})
