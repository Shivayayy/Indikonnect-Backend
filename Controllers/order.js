const mongoose = require('mongoose');
const Order = require('../Models/order');
const Shop = require('../Models/shop'); 
const shopItemSchema = require('../Models/shopItem');
const User =require('../Models/user')
const Item =require('../Models/item');

const createOrder = async (req, res) => {
  try {
    const { validatedItems, location, shopId } = req.body;
    const items = validatedItems;
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const { itemId, price, quantity, variantId } = item;
      

      // Ensure that itemId is converted to ObjectId correctly
      const validItemId = new mongoose.Types.ObjectId(itemId);
      if (!price || !quantity) {
        return res.status(400).json({ error: 'Price and quantity are required for each item' });
      }
      const fetchedItem = await Item.findById(validItemId);
      if (!fetchedItem) {
        return res.status(404).json({ error: `Item with ID ${itemId} not found` });
      }
      // Calculate total price for the current item
      const totalPriceForItem = price * quantity;
      total += totalPriceForItem;

      orderItems.push({
        variantId,
        itemId: validItemId,
        itemName: fetchedItem.itemName,
        price,
        quantity,
      });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }
    
    const shopkeeperLocation = shop.location.coordinates;
    const customerLocation = location.coordinates;
    const distanceInKm = calculateDistance(shopkeeperLocation, customerLocation);
    
    if (isNaN(distanceInKm)) {
      return res.status(400).json({ error: 'Invalid distance calculation' });
    }
    
    const deliveryChargePerKm = 5.75;
    const deliveryCharge = (distanceInKm * deliveryChargePerKm).toFixed(2); // Round off to two decimal points
    
    if (isNaN(deliveryCharge)) {
      return res.status(400).json({ error: 'Invalid delivery charge calculation' });
    }
    
    const serviceCharge = 2.00;

    const newOrder = new Order({
      customerId: req.user._id,
      shopId,
      items: orderItems,
      total,
      deliveryCharge,
      serviceCharge,
      location,
      status: 'pending',
    });

    await newOrder.save();

    return res.status(201).json({
      message: 'Order created successfully, waiting for shopKeeper response',
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const axios = require('axios');

async function getReverseGeocode(latitude, longitude) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const { address } = response.data;
        return address;
    } catch (error) {
        console.error('Error fetching reverse geocode:', error);
        throw error;
    }
}

const specificOrderShopkeeper = async (req, res) => {
  try {
    const { status } = req.params; // Get the status from the query parameters

    // Find the shopId for the given shopkeeper
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    // Query the Order database for all orders with the shopId and the specified status
    const orders = await Order.find({
      shopId: shop._id,
      status: status || { $in: ['pending', 'in-transaction','Out for delivery', 'completed','rejected'] },
    });

    if (orders.length === 0) {
      return res.status(200).json({ message: 'No orders found'});
    }

    // Fetch customer names, addresses, and item names for each order
    const ordersWithDetails = await Promise.all(orders.map(async order => {
      const customer = await User.findById(order.customerId);
      const address = await getReverseGeocode(order.location.coordinates[1], order.location.coordinates[0]);

      // Populate the itemId field and select the itemName
      const itemsWithNames = await Promise.all(order.items.map(async item => {
        const { itemName } = await Item.findById(item.itemId, 'itemName');
        return {
          ...item.toObject(),
          itemName
        };
      }));

      return {
        ...order.toObject(),
        customerName: customer ? customer.UserName : 'Unknown',
        address: address, // Address obtained from reverse geocoding
        items: itemsWithNames
      };
    }));

    return res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const allOrderShopkeeper = async (req, res) => {
  try {
    // Find the shopId for the given shopkeeper
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    // Query all orders for the shopId
    const orders = await Order.find({ shopId: shop._id });

    if (orders.length === 0) {
      return res.status(200).json({ message: 'No orders found' });
    }

    // Initialize arrays for each status
    const ordersByStatus = {
      pending: [],
      processing: [],
      completed: [],
      rejected: [],
      outForDelivery: [],
      paid: []
    };

    // Categorize orders based on status and fetch customer names, addresses, and item names
    await Promise.all(orders.map(async order => {
      const customer = await User.findById(order.customerId);
      const address = await getReverseGeocode(order.location.coordinates[1], order.location.coordinates[0]);

      const itemsWithNames = await Promise.all(order.items.map(async item => {
        const { itemName } = await Item.findById(item.itemId, 'itemName');
        return {
          ...item.toObject(),
          itemName
        };
      }));

      const orderWithDetails = {
        ...order.toObject(),
        customerName: customer ? customer.UserName : 'Unknown',
        address: address, // Address obtained from reverse geocoding
        items: itemsWithNames
      };

      ordersByStatus[order.status].push(orderWithDetails);
    }));

    return res.status(200).json(ordersByStatus);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const processOrder = async (req, res) => {
  try {
    const { status, orderId } = req.body;

    // Check if orderId is provided
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId in request body' });
    }

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'reject') {
      order.status = 'rejected';
      await order.save();
      return res.status(200).json({ message: 'Order rejected successfully' });
    } else if (status === 'accept') {
      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Order status is not pending' });
      }
      order.status = 'processing';
      await order.save();
      return res.status(200).json({ message: 'Order accepted and processing' });
    } else {
      return res.status(400).json({ error: 'Invalid status provided' });
    }
  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const completedOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Check if orderId is provided
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId in request body' });
    }

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'processing') {
      return res.status(400).json({ error: 'Order status is not outForDelivery' });
    }

    order.status = 'completed';
    await order.save();
    return res.status(200).json({ message: 'Order completed successfully' });
  } catch (error) {
    console.error('Error completing order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if orderId is provided
    if (!orderId) {
      return res.status(404).json({ message: `Order with orderId ${orderId} not found` });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: `Order with orderId ${orderId} not found` });
    }
    if (order.status !== 'paid') {
      return res.status(200).json({ message: 'Inventory already up to date' });
    }

    for (const item of order.items) {
      
      const shopItem = await shopItemSchema.findOne({ itemId: item.itemId });
      if (shopItem) {
        const variant = shopItem.variantQuantity.find(v => v.variantId === item.variantId);
        if (variant) {
          variant.quantity -= item.quantity;
        }
        await shopItem.save();
      }
    }
    order.status ='outForDelivery';
    await order.save();

    return res.status(200).json({ message: 'Inventory updated successfully' });
  } catch (error) {
    console.error('Fatal error :inventory not updated:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



function calculateDistance(coord1, coord2) {
  const lat1 = coord1[1];
  const lon1 = coord1[0];
  const lat2 = coord2[1];
  const lon2 = coord2[0];
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}



module.exports = { createOrder,allOrderShopkeeper,processOrder,updateInventory ,specificOrderShopkeeper ,completedOrder};