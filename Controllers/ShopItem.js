// controllers/shopItem.js

const Item = require('../Models/item');
const shopItem =require('../Models/shopItem');
const Shop = require('../Models/shop');

const searchProduct = async (req, res, next) => {
    try {
        const { itemName } = req.body; 
        const regex = new RegExp('^' + itemName, 'i');
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
        if (req.body.productFound) {
            const { quantity, price } = req.body;
            const product = req.body.product;
            const ownerId =req.user._id;

            // Find the shop based on owner's ID
            const shop = await Shop.findOne({ owner :ownerId });

            if (shop) {
                // Find the product from the database
                const foundProduct = await shopItem.findOne({ itemName: product });

                if (foundProduct) {
                    // Create a new shopItem
                    const newShopItem = new shopItem({
                        shopId: shop._id,
                        itemName: foundProduct.itemName,
                        description: foundProduct.description,
                        price: price,
                        quantity: quantity,
                        netWeight: foundProduct.netWeight,
                        unit: foundProduct.unit,
                        category: foundProduct.category,
                        imageUrl: foundProduct.imageUrl
                    });

                    // Save the new shopItem to the database
                    await newShopItem.save();

                    res.status(200).json({ message: 'Shop item created successfully' });
                } else {
                    res.status(404).json({ message: 'Product not found in the database' });
                }
            } else {
                res.status(404).json({ message: 'Shop not found for the given owner' });
            }
        } else {
            res.status(501).json({ message: 'Product not found, add product' });
        }
    } catch (error) {
        console.error('Error Adding data, try again', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {searchProduct,autoUpdate};

