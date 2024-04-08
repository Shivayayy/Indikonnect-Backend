const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
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
        price: {
            type: Number,
            required: true
        },
        variantId: {
            type: Number,
            required: true,
        },
        itemName :{
            type:String,
            //required:true,
        }
    }],
    total: {
        type: Number,
        required: true
    },
    deliveryCharge: {
        type: Number,
        required: true
    },
    serviceCharge: {
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
        enum: ['pending', 'processing', 'completed', 'rejected', 'outForDelivery', 'paid'],
        default: 'pending'
    }
});

// Define a virtual property for GrandTotal
orderSchema.virtual('grandTotal').get(function() {
    // Calculate GrandTotal as the sum of Total, DeliveryCharge, and ServiceCharge
    return this.total + this.deliveryCharge + this.serviceCharge;
});

orderSchema.index({ location: "2dsphere" }); // Index for geospatial query

module.exports = mongoose.model('Order', orderSchema);
