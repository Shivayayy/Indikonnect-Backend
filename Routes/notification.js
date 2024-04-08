const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWare/auth');
const {createNotification,getNotifications,markAsRead} = require('../Controllers/notification');

router.post('/createNotification', isAuth, createNotification);
router.get('/getNotification',isAuth,getNotifications);
module.exports =router