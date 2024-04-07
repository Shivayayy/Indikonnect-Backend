const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWare/auth');
const {fetchShopkeeperData} = require('../Controllers/shopkeeper');

// Route for fetching shopkeeper data
router.get('/fetchShopData', isAuth,fetchShopkeeperData);
module.exports = router;
