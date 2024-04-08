const express = require('express');
const router = express.Router();
const { createShop, uploads } = require('../Controllers/shop');
const { isAuth } = require('../MiddleWare/auth');

// Route for creating a new shop with image upload to Google Drive
router.post(
    '/create-shop',
    isAuth,
    uploads.single('image'), // Middleware for handling image upload
    createShop
);

module.exports = router;
