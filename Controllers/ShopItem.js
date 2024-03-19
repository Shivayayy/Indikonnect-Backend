// controllers/shopItem.js

const Item = require('../Models/item');
const shopItem =require('../Models/shopItem');
const Shop = require('../Models/shop');

const searchProduct = async (req, res, next) => {
    try {
        const { itemName } = req.body; 
        const regex = new RegExp(itemName, 'i');
        const products = await Item.find({ itemName: { $regex: regex } });

        if (products.length > 0) {
            req.productFound = true;
            req.products = products;
            console.log('Found products:', products); // Log the found products
            res.status(200).json({ message: 'Products found', products });
        } else {
            req.productFound = false;
        }
        next();
    } catch (error) {
        console.error('Error searching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const autoUpdate = async (req, res) => {
    try {

        const { quantity, price, itemId } = req.body;
        const ownerId = req.user._id;

        // Find the shop based on owner's ID
        const shop = await Shop.findOne({ owner: ownerId });

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found for the given owner' });
        }

        // Find the product from the database
        const foundProduct = await Item.findOne({ _id: itemId });

        if (!foundProduct) {
            return res.status(404).json({ message: 'Product not found in the database' });
        }

        //console.log('Found Product:', foundProduct); // Log the found product

        let priceIndex = -1;
        for (let i = 0; i < foundProduct.variants.length; i++) {
            if (foundProduct.variants[i].price === price) {
                priceIndex = i;
                break;
            }
        }
        if (priceIndex === -1) {
            return res.status(404).json({ message: 'Price not found for the product' });
        }
        console.log(`Index found at ${priceIndex}`)
        const foundShopItem =await shopItem.findOne({itemId:itemId});
        if(!foundShopItem)
        {
            console.log('item not already in shop')
            console.log
            const newShopItem =new shopItem({
                itemId :itemId,
                shopId :shop._id,
                variantQuantity :[
                    {
                        variantId : priceIndex,
                        quantity : quantity,
                    }
                ]
            })
            await newShopItem.save();
        }
        else 
        {
            const variantIndex = foundShopItem.variantQuantity.findIndex(variantQuantity => variantQuantity.variantId === priceIndex);
            if(variantIndex === -1) 
            {
                console.log('variant not already in shop')
                foundShopItem.variantQuantity.push(
                {
                    variantId: priceIndex,
                    quantity: quantity
                });
                await foundShopItem.save();
            }
            else 
            {
                const val =foundShopItem.variantQuantity[variantIndex].quantity;
                foundShopItem.variantQuantity[variantIndex].quantity = val + quantity;
                await foundShopItem.save();
            }
        }

        res.status(200).json({ message: 'Shop item created successfully' });
    } catch (error) {
        console.error('Error updating shop item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {searchProduct,autoUpdate};

