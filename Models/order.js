const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shopItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price : {
            type :Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed'],
        default: 'pending'
    }
});

orderSchema.index({ location: "2dsphere" }); // Index for geospatial query

module.exports = mongoose.model('Order', orderSchema);
