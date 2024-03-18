const mongoose =require('mongoose');

const shopItemSchema =new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price :{
        type :Number,
        required :true,
    },
    quantity :{
        type :Number,
        required :true,
    },
    netWeight :{
        type :Number
    },
    unit :{
        type :Number,
        required :true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Groceries', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Beverages', 'Snacks', 'Household', 'Personal Care','Others'] 
    },
    imageUrl: {
        type: String 
    },

})

const shopItem = mongoose.model('shopItem', shopItemSchema);
module.exports = shopItem;