const express = require('express');
const router = express.Router();
const validateOrder = require('../MiddleWare/validation/order');
const { createOrder, allOrderShopkeeper,processOrder } = require('../Controllers/order');
const { isAuth } = require('../MiddleWare/auth');

// Define the route for processing orders
router.post('/createOrder', isAuth, validateOrder, createOrder);
router.get('/allOrderShopkeeper', isAuth, allOrderShopkeeper);
router.post('/processOrder',isAuth,processOrder);

module.exports = router;