// controllers/shopItem.js

const Item = require('../models/items');

const search = async (req, res, next) => {
    try {
        const { itemName } = req.body; 
        const product = await Item.findOne({ itemName });

        if (product) {
            req.productFound = true;
            req.product = product;
            res.status(200).json({ message: 'Product found', product });
        } else {
            req.productFound = false;
        }
        next();
    } catch (error) {
        console.error('Error searching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const autoUpdate =async(req,res)=>{
    try{
        if(req.body.productFound)
        {
                const {shopItemName,description,price,quantity,netWeight,unit,category,imageUrl} = req.body

        }
        else
        {
            res.status(501).json({message :'Producd not found ,add product'})
        }
    }catch (error) {
        console.error('Error Adding data,try again', error);
        res.status(500).json({ message: 'Internal server error' });
    
};



module.exports = {searchProduct,autoUpdate};

