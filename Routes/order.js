const express = require('express');
const router = express.Router();
const validateOrder =require('../MiddleWare/validation/order')
const { createOrder } = require('../Controllers/order');

// Define the route for processing orders
router.post('/createOrder', validateOrder,createOrder); 

module.exports = router;
