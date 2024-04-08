// routes/payment.js
const express = require('express');
const paymentController = require('../Controllers/payment');

const router = express.Router();

router.post('/intent', paymentController.createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhookEvent);

module.exports = router;