//jshint esversion:9


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Content = require("./models/Content")
const Categories = require("./models/Categories")
// const dbUrl = "mongodb://localhost:27017/kate";
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/Users');
const flash = require('connect-flash');

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const users = require("./routes/users");
const checkout = require("./routes/checkout")
const content = require("./routes/content")
const catchAsync = require("./utils/catchAsync");
const {getLastMonth} = require("./utils/dateTime")
const ExpressError = require("./utils/ExpressError")
const admin = require("./routes/admin")
const MongoDBStore = require('connect-mongo');


const con = mongoose.connect("mongodb://localhost:27017/kate-test", {
	useNewUrlParser: true,
});

const db = mongoose.connection;






db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
	console.log("i am in");
});
app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
app.use(express.json());



const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store =  MongoDBStore.create({
    mongoUrl: "mongodb://localhost:27017/kate-test",
    
    touchAfter: 24 * 60 * 60
});

 store.on("error", function (e) {
     console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session({secret: secret,
    resave: true,
    saveUninitialized: true,
	cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
	store: store
}));


app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use("/users", users);
app.use("/admin", admin) 
app.use("/checkout", checkout)
app.use("/content", content)


app.get("/", catchAsync(async (req, res) => {
    const lastMonth = getLastMonth()
	const categories = await Categories.find({}).populate("content");
    const latestContent = await Content.find({date:{$gte: lastMonth}})
    let latestImages = latestContent.filter(el=> el.category)
     latestImages = latestImages.map(el => ({image:el.images, 
        id:(el._id.toString()),
        category:el.category,
        title:el.title
    
    }) )
        
    
	res.render("./home", { categories,  latestContent, latestImages   });
}));


// app.get("/payment", async(req, res)=>{
  
// 	res.render("./checkout")
// })


// app.get("/success", (req, res)=>{
// 	res.render("./success")
// })

// app.get("/cancel", (req,res)=>{
//   res.render("./success")
// })




app.all("*", (req, res, next) => {
	next(new ExpressError("page not found", "404"));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = "something went wrong";
	res.status(status).render("error", { err });
});


const port = process.env.PORT || 3000;
app.listen(port);