const express = require("express");
const Content = require("../models/Content");
const { getObject, downloadURL } = require("../aws/aws");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = "http://localhost:3000/";
const { Buffer } = require("buffer");
const axios = require("axios");

const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");

const fs = require("fs");
const https = require("https");

// Set the AWS Region.
const REGION = "us-east-2"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
AWS.config.update({
  region: REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

router.post("/:contentId", async (req, res) => {
  const { contentId } = req.params;
  let itemPrice = req.body;
  itemPrice = parseInt(Object.values(itemPrice)[0]);

  const content = await Content.findById(contentId);
  if (!content.price.includes(itemPrice)) {
    itemPrice = content.price[content.price.length - 1];
  }
  const product = await stripe.products.create({
    name: content.title,
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: itemPrice * 100,
    currency: "usd",
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/checkout/${content._id}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.redirect(303, session.url);
});
const request = async function getUser(url) {
  try {
    const response = await axios.get(url, { responseType: "blob" });
    return response;
  } catch (error) {
    console.error(error);
  }
};
router.get("/:id/success", async (req, res) => {
  const params = { Bucket: process.env.Bucket, Key: req.params.id };
  const object = await downloadURL(params);
  const response = await request(object);
  res.render("checkout/success", { object });
});
module.exports = router;
