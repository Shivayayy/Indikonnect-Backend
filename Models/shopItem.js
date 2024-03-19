const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({

    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    variantQuantity: [{
        variantId: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
});

module.exports = mongoose.model('shopItem', shopItemSchema, 'shopItem');
