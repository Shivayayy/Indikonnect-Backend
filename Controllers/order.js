const Order = require('../Models/order');
const Cart = require('../Models/cart');

async function processOrder(req, res) {
    try {
        const { location } = req.body;
        const cartItems = await Cart.find({ cartOwner: req.user._id, }); 

        let total = 0;
        const orderItems = [];
        for (const cartItem of cartItems) {
            const totalPriceForItem = cartItem.price * cartItem.quantity;
            total += totalPriceForItem;
            orderItems.push({
                itemId: cartItem.itemId,
                quantity: cartItem.quantity,
                totalForItem :totalPriceForItem,

            });
        }

        const newOrder = new Order({
            items: orderItems,
            total,
            location,
            status: 'pending' 
        });

        await newOrder.save();
        return res.status(201).json({ message: 'Order processed successfully', orderId: newOrder._id });

    } catch (error) {
        console.error('Error processing order:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    processOrder
};
