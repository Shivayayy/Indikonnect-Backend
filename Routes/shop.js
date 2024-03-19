const express = require('express');
const router = express.Router();
const { createShop, uploads } = require('../Controllers/shop');
const { isAuth } = require('../MiddleWare/auth');
const { validateShopCreation, shopValidation } = require('../MiddleWare/validation/shop'); 

// Route for creating a new shop
router.post(
    '/create-shop',
    isAuth,
    //uploads.single('shopImage'),
    validateShopCreation,
    shopValidation,
    createShop
);

module.exports = router;
