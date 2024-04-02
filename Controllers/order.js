const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample data store for orders
let orders = [];

app.use(bodyParser.json());

// Route to create a new order
app.post('/orders', (req, res) => {
    const { customerId, items } = req.body;

    // Generate unique order ID
    const orderId = Math.floor(Math.random() * 1000);

    const newOrder = {
        id: orderId,
        customerId: customerId,
        items: items,
        status: 'pending' // Initial status of the order
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
});

// Route to update an existing order status
app.put('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const orderToUpdate = orders.find(order => order.id === orderId);

    if (!orderToUpdate) {
        return res.status(404).json({ message: 'Order not found' });
    }

    orderToUpdate.status = status;

    res.json(orderToUpdate);
});

// Route to delete an existing order
app.delete('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);

    orders = orders.filter(order => order.id !== orderId);

    res.json({ message: 'Order deleted successfully' });
});

// Route to retrieve all orders
app.get('/orders', (req, res) => {
    res.json(orders);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
