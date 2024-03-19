const mongoose = require('mongoose');

const ShopitemSchema = new mongoose.Schema({

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
        },
        quantity :{
            type :Number,
            required :true,
        }
    }],
});

module.exports = mongoose.model('shopItem', ShopitemSchema, 'shopItem');
