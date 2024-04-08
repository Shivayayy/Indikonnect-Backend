
const stripe = require('./stripe');
const Order = require('../Models/order');
// controllers/paymentController.js
exports.createPaymentIntent = async (req, res) => {
    try {
      const { orderId, amount } = req.body;
  
      // Create a Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe uses cents as the currency unit
        currency: 'usd',
        metadata: { orderId },
      });
  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.handleWebhookEvent = async (req, res) => {
    let event;
  
    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        'your_stripe_webhook_secret'
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
  
        // Update the order status
        const order = await Order.findOne({ _id: paymentIntent.metadata.orderId });
        order.status = 'paid';
        await order.save();
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log(`PaymentMethod ${paymentMethod.id} was attached to customer ${paymentMethod.customer}`);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    res.json({ received: true });
  };