const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWare/auth');
const { userInfo,shopsNearBy,onTappingShop } = require('../Controllers/customer.js');

 router.post('/userInfo', isAuth, userInfo);
 router.post('/shopsNearBy',isAuth,shopsNearBy);
// router.post('/onTappingShop',isAuth,onTappingShop);
module.exports = router;
