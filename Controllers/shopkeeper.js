const User = require('../Models/user');
const Shop = require('../Models/shop');
const ShopItem = require('../Models/shopItem');
const Item = require('../Models/item');

async function fetchShopkeeperData(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const shop = await Shop.findOne({ owner: req.user._id });
        const shopItems = await ShopItem.find({ shopId: shop._id });

        const itemIds = shopItems.map(item => item.itemId);
        const items = await Item.find({ _id: { $in: itemIds } });

        const responseData = {
            user: user,
            shop: shop,
            shopItems: []
        };

        for (const shopItem of shopItems) {
            const item = items.find(item => item._id.equals(shopItem.itemId));
            if (item) {
                const shopItemDetails = {
                    itemId: item._id,
                    itemName: item.itemName,
                    description: item.description,
                    category: item.category,
                    imageUrl: item.imageUrl,
                    reviews: item.reviews,
                    variants: []
                };

                for (const variantQuantity of shopItem.variantQuantity) {
                    const variantIndex = variantQuantity.variantId;
                    if (variantIndex < item.variants.length) {
                        const variant = item.variants[variantIndex];
                        const shopItemVariant = {
                            price: variant.price,
                            netWeight: variant.netWeight,
                            unit: variant.unit,
                            quantity: variantQuantity.quantity
                        };
                        shopItemDetails.variants.push(shopItemVariant);
                    }
                }

                responseData.shopItems.push(shopItemDetails);
            }
        }

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching shopkeeper data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    fetchShopkeeperData
};
