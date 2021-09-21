const stripe = require('stripe')('sk_test_51JOSAoGIEwgSXQBl3rvXm2jXLusMk71DrjpMSyA09HZ1EY7WGijDjaT2yELahnbVgXB41J8wSuwV2fCo3TDpSIq500bsQ8ldfs');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';


app.listen(4242, () => console.log('Running on port 4242'));