// controllers/shopItem.js
const {authorize,uploadFileToDrive} =require('./fileUploader');
const Item = require('../Models/item');
const shopItem = require('../Models/shopItem');
const Shop = require('../Models/shop');

const searchProduct = async (req, res, next) => {
    try {
        const { itemName } = req.body; 
        if (!itemName || itemName.trim().length === 0) {
            return res.status(400).json({ message: "Please provide a product name to search." });
        }
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

const autoUpdate = async (req, res, next) => {
    try {
        const { quantity, price, itemId } = req.body;
        const ownerId = req.user._id;

        const shop = await Shop.findOne({ owner: ownerId });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found for the given owner' });
        }

        const foundProduct = await Item.findOne({ _id: itemId });
        if (!foundProduct) {
            return res.status(404).json({ message: 'Product not found in the database' });
        }

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

        const foundShopItem = await shopItem.findOne({ itemId: itemId });

        if (!foundShopItem) {
            const newShopItem = new shopItem({
                itemId: itemId,
                shopId: shop._id,
                variantQuantity: [
                    {
                        variantId: priceIndex,
                        quantity: quantity,
                    }
                ]
            });
            await newShopItem.save();
        } else {
            const variantIndex = foundShopItem.variantQuantity.findIndex(variantQuantity => variantQuantity.variantId === priceIndex);
            if (variantIndex === -1) {
                foundShopItem.variantQuantity.push({
                    variantId: priceIndex,
                    quantity: quantity
                });
                await foundShopItem.save();
            } else {
                const val = foundShopItem.variantQuantity[variantIndex].quantity;
                foundShopItem.variantQuantity[variantIndex].quantity = val + quantity;
                await foundShopItem.save();
            }
        }

        res.status(200).json({ message: 'Shop item updated successfully' });
    } catch (error) {
        console.error('Error in auto updating shop item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const manualUpdate = async (req, res) => {
    try {
        const {
            itemName,
            description,
            price,
            netWeight,
            unit,
            category,
            quantity,
            path,
            originalname
        } = req.body;

       
        if (!itemName || !description || !price || !netWeight || !unit || !category || !quantity) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        //console.log(itemName,description,price,netWeight,unit,category,quantity,path,originalname)
        const foundShopItembyName = await shopItem.findOne({ itemName: itemName });
        if(foundShopItembyName)
        {
            return res.status(402).json({message :'Item already exists , search and add'})
        }
        const authClient = await authorize();
        const imageUrl = await uploadFileToDrive(authClient, path, originalname);

        const newItem = new Item({
            itemName: itemName,
            description: description,
            variants: [
                {
                    price: price,
                    netWeight: netWeight,
                    unit: unit
                }
            ],
            category: category,
            imageUrl :imageUrl,
        });

        const savedItem = await newItem.save();
        const newItemId = savedItem._id;

        req.body.itemId = newItemId; 
        await autoUpdate(req, res); 
        return; //res.status(200).json({ message: 'Shop item manually updated successfully' });
        
        //next();

    } catch (error) {
        console.error('Error in manually updating shop item:', error);
        return res.status(500).json({ message: 'Internal server error' });
       
    }
};

const updateVariant =async (req,res)=>{
    try{
        const {itemId,price,quantity,unit,netWeight} =req.body;
        if(!itemId || !price || !quantity || !netWeight)
        {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const foundItem = await Item.findOne({ _id: itemId });
        if (!foundItem) 
        {
            return res.status(404).json({ message: 'Product not found in the database' });
        }
        let priceIndex = -1;
        for (let i = 0; i < foundItem.variants.length; i++) {
            if (foundItem.variants[i].price === price) {
                priceIndex = i;
                break;
            }
        }

        if (priceIndex === -1) {
            foundItem.variants.push({
                price : price,
                netWeight : netWeight,
                unit : unit  
            });
            await foundItem.save();
            await autoUpdate(req, res); 
            
        }
        else 
        {
            return res.status(402).json({ message: 'variant already exists' });
        }
        
    }
    catch(error){
        console.error('Error in updating variant field in Global Item set', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { searchProduct, autoUpdate, manualUpdate,updateVariant};
