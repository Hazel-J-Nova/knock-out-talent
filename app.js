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
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const users = require("./routes/users");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError")
const admin = require("./routes/admin")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = "http://localhost:3000/"

const con = mongoose.connect("mongodb://localhost:27017/katetest", {
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



app.use("/users", users);
app.use("/admin", admin)


app.get("/", catchAsync(async (req, res) => {
	const categories = await Categories.find({});

	
	res.render("./home", { categories,  });
}));


app.get("/payment", async(req, res)=>{
  
	res.render("./checkout")
})


app.get("/success", (req, res)=>{
	res.render("./success")
})

app.get("/cancel", (req,res)=>{
  res.render("./success")
})


app.post('/create-checkout-session', async (req, res) => {

  const product = await stripe.products.create({
    name: 'Starter Dashboard',
  });
  
const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 1000,
  currency: 'usd',
 
  })

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // TODO: replace this with the `price` of the product you want to sell
        price: price.id,
        quantity: 1,
      },
    ],
    payment_method_types: [
      'card',
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.redirect(303, session.url)
});

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