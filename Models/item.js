const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    prices: [{
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'], 
            required: true
        }
    }],
    netWeight: {
        value: {
            type: Number,
        },
        unit: {
            type: String,
            enum: ['g', 'kg', 'oz', 'lb'] 
        }
    },
    units: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    category: {
        type: String,
        required: true,
        enum: ['Groceries', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Beverages', 'Snacks', 'Household', 'Personal Care','Others'] 
    },
    imageUrl: {
        type: String 
    }
});

module.exports = mongoose.model('Item', itemSchema ,'Item');
