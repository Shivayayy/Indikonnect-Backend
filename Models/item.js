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
    variants: [{
        price: {
            type: Number,
            required: true
        },
        netWeight: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            enum: ['g', 'kg'],
            required: true
        }
    }],
    category: {
        type: String,
        required: true,
        enum: ['Groceries', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Beverages', 'Snacks', 'Household', 'Personal Care', 'Others'] 
    },
    imageUrl: {
        type: String 
    },
    reviews: [{
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Item', itemSchema, 'Item');
