const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWare/auth');
const { userInfo,shopsNearBy } = require('../Controllers/customer.js');

router.post('/user-info', isAuth, userInfo);
router.post('/shopsNearBy',isAuth,shopsNearBy);
module.exports = router;
