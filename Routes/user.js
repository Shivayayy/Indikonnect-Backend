const express = require('express');
const router = express.Router();
const { createUser, userSignIn } = require('../Controllers/user');
const { validateUserSignUp, userValidation, validateUserSignIn } = require('../MiddleWare/validation/user');
const { isAuth } = require('../MiddleWare/auth');

router.post('/create-user', validateUserSignUp, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);

module.exports = router;
