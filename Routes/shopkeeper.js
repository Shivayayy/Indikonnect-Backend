const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWare/auth');

const { createShop, uploads } = require('../Controllers/shop');
const { validateShopCreation, shopValidation } = require('../MiddleWare/validation/shop'); 

// Route for creating a new shop
router.post(
    '/create-shop',
    isAuth,
    uploads.single('shopImage'),
    validateShopCreation, 
    shopValidation,
    createShop
);


//Route for creating itenary from search list
router.post(
    '/auto-manage-itenary',
    isAuth,
    createAutoShopItem,
);

//Route for creating itenary from 
router.post(
    '/manual-manage-itenary',
    isAuth,
    validateShopItemCreation,
    shopItemValidation,
    createManualShopItem,
);

module.exports = router;