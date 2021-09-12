//jshint esversion:9


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// const dbUrl = "mongodb://localhost:27017/kate";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");


mongoose.connect("mongodb://localhost:27017/katetest", {
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
app.use(express.static(path.join(__dirname, "public")));


app.use("/", users);


app.get("/", (async (req, res) => {
	//to do make category model
	//to do make creator model
	const content = await Content.find({});
	
	categories = new Set(category);
	categories = Array.from(categories);
	res.render("../home", { categories, creators });
}));


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