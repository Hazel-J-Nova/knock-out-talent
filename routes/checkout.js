const express = require("express");
const Content = require("../models/Content");
const Creator = require("../models/Creators");
const { getObject, downloadURL } = require("../aws/aws");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, hasPurchased, isCreator } = require("../utils/middleware");
const stripe = require("stripe")(process.env.stripe_secret_key);
const YOUR_DOMAIN = "http://www.knockouttalent.com";
const { Buffer } = require("buffer");
const axios = require("axios");

const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");

const fs = require("fs");
const https = require("https");
const { countDocuments } = require("../models/Content");
// const accountLink = async () => {
//   await stripe.accountLinks.create({
//     account: "acct_1032D82eZvKYlo2C",
//     refresh_url: "https://example.com/reauth",
//     return_url: "https://example.com/return",
//     type: "account_onboarding",
//   });
// };

const account = async () => await stripe.accounts.create({ type: "express" });
// Set the AWS Region.
const REGION = "us-east-2"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
AWS.config.update({
  region: REGION,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
});
const s3 = new AWS.S3();

router.post(
  "/:contentId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { contentId } = req.params;
    let itemPrice = req.body;
    itemPrice = parseInt(Object.values(itemPrice)[0]);

    const content = await Content.findById(contentId);
    const creator = await Creator.findById(content.creator);

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
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/checkout/${content._id}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      payment_intent_data: {
        application_fee_amount: itemPrice * 7.25 + 30,
        transfer_data: {
          destination: creator.account,
        },
      },
    });
  })
);

router.get(
  isLoggedIn,
  hasPurchased,
  catchAsync(async (req, res) => {
    const fileStore = [];
    const { contentId } = req.params;
    const content = await Content.findById(contentId);
    for (let numStep = 0; numStep <= content.numberOfFiles; numStep++) {
      const params = {
        Bucket: process.env.Bucket,
        Key: `${req.params.id}/${numStep}`,
      };
      const object = await downloadURL(params);
      const response = await request(object);
      fileStore.push(object);
    }
    res.render("checkout/success", { fileStore, content });
  })
);

module.exports = router;
