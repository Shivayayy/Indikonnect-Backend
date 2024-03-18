const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWare/auth');

const { createShop, uploads } = require('../Controllers/shop');
const { validateShopCreation, shopValidation } = require('../MiddleWare/validation/shop'); 
const {searchProduct,autoUpdate } = require('../Controllers/shopItem');

// Route for creating a new shop
router.post(
    '/create-shop',
    isAuth,
    uploads.single('shopImage'),
    validateShopCreation, 
    shopValidation,
    createShop
);

router.post(
    '/search-product',
    isAuth ,
    searchProduct,
)


module.exports = router;