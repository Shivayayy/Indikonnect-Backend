const Shop = require('../Models/shop');
const User = require('../Models/user');
const Item = require('../Models/item');
const ShopItem = require('../Models/shopItem');

const userInfo = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in userInfo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const shopsNearBy = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        const nearbyShops = await Shop.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    distanceField: "distance",
                    maxDistance: 3000,
                    spherical: true
                }
            }
        ]);
        console.log(nearbyShops)
        // Fetch owner names and top three categories for each nearby shop
        const nearbyShopsWithOwnerNamesAndTopCategories = await Promise.all(nearbyShops.map(async (shop) => {
            const owner = await User.findById(shop.owner);
            const shopItems = await ShopItem.find({ shopId: shop._id });

            // Fetch items and their categories
            const itemsWithCategories = await Promise.all(shopItems.map(async (shopItem) => {
                const item = await Item.findById(shopItem.itemId);
                return { category: item.category };
            }));

            // Count categories occurrence
            const categoryCount = {};
            itemsWithCategories.forEach(item => {
                const category = item.category;
                categoryCount[category] = (categoryCount[category] || 0) + 1;
            });

            const sortedCategories = Object.keys(categoryCount).sort((a, b) => categoryCount[b] - categoryCount[a]);
            const topThreeCategories = sortedCategories.slice(0, 3);

            const items = await Promise.all(shopItems.map(async (shopItem) => {
                const item = await Item.findById(shopItem.itemId);
                return item;
            }));
            return {
                shop: shop,
                itemList :items,
                distance: Math.floor(shop.distance),
                ownerUserName: owner ? owner.UserName : 'Unknown',
                topCategories: topThreeCategories
            };
        }));

        res.json({ nearbyShops: nearbyShopsWithOwnerNamesAndTopCategories });
    } catch (error) {
        console.error('Error in fetching nearby shops: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = { userInfo, shopsNearBy };

