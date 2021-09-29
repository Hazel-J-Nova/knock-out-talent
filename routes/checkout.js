const express = require("express");
const Content = require("../models/Content");

const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = "http://localhost:3000/"


router.post('/:contentId', async (req, res) => {
    const {contentId} = req.params
    const content =await Content.findById(contentId)
    const product = await stripe.products.create({
      name: content.title
    });
    
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: (content.price *100),
    currency: 'usd',
   
    })
    console.log(price)
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

  module.exports = router;
