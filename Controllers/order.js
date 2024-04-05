const mongoose = require('mongoose');

const Order = require('../Models/order');

const createOrder = async (req, res) => {
    console.log(req.body);
  
    try {
      const { items, location } = req.body;
  
      const orderItems = [];
      let total = 0;
  
      for (const item of items) {
        const { itemId, price, quantity } = item;
  
        // Ensure that itemId is converted to ObjectId correctly
        const validItemId = new mongoose.Types.ObjectId(itemId);
  
        // Validate that price and quantity are provided
        if (!price || !quantity) {
          return res.status(400).json({ error: 'Price and quantity are required for each item' });
        }
  
        // Calculate total price for the current item
        const totalPriceForItem = price * quantity;
        total += totalPriceForItem;
  
        orderItems.push({
          itemId: validItemId,
          price,
          quantity
        });
      }
  
      const newOrder = new Order({
        items: orderItems,
        total,
        location,
        status: 'pending'
      });
  
      await newOrder.save();
  
      return res.status(201).json({ message: 'Order created successfully, waiting for shopKeeper response', orderId: newOrder._id });
    } catch (error) {
      console.error('Error processing order:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = { createOrder };