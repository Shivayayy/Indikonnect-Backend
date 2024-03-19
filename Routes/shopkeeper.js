const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWare/auth');

const { createShop, uploads } = require('../Controllers/shop');
const { validateShopCreation, shopValidation } = require('../MiddleWare/validation/shop'); 
const {searchProduct,autoUpdate } = require('../Controllers/shopItem');



router.post(
    '/search-product',
    searchProduct,
)

router.post(
    '/auto-update',
    isAuth,
    autoUpdate,
)


module.exports = router;