const stripe = require('stripe')('sk_test_51JOSAoGIEwgSXQBl3rvXm2jXLusMk71DrjpMSyA09HZ1EY7WGijDjaT2yELahnbVgXB41J8wSuwV2fCo3TDpSIq500bsQ8ldfs');


const stripeObject = async () =>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'usd',
        payment_method_types: ['card'],
        receipt_email: 'jenny.rosen@example.com',
      })

 }


stripeObject.then(paymentIntent)

