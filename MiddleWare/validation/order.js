
const Item = require('../../Models/item'); // Adjust the path to the Item model
const ShopItem = require('../../Models/shopItem'); // Adjust the path to the ShopItem model

async function validateOrderItems(req, res, next) {
    try {
      const { items } = req.body;
      const errors = [];
  
      for (const item of items) {
        const { itemId, price, quantity } = item;
  
        // Find the item in the database to get its variant
        const dbItem = await Item.findById(itemId);
        if (!dbItem) {
          errors.push(`Item with ID ${itemId} not found.`);
          continue;
        }
  
        // Find the variant index based on the price
        const variantIndex = dbItem.variants.findIndex((v) => v.price === price);
        if (variantIndex === -1) {
          errors.push(`Variant with price ${price} not found for item ${itemId}.`);
          continue;
        }
  
        // Get the variantId from the dbItem.variants array
        const variantId = variantIndex;
  
        // Find the shop item with the matching itemId and variantId
        const shopItem = await ShopItem.findOne({
          itemId,
          'variantQuantity.variantId': variantId,
        });
  
        if (!shopItem) {
          errors.push(
            `Shop does not have the item with ID ${itemId} and variant ID ${variantId}.`
          );
          continue;
        }
  
        // Find the available quantity for the variant
        const variantQuantity = shopItem.variantQuantity.find((v) =>
          v.variantId === variantId
        );
        const availableQuantity = variantQuantity.quantity;
  
        if (quantity > availableQuantity) {
          errors.push(
            `Item with ID ${itemId} exceeds available quantity. Available quantity: ${availableQuantity}.`
          );
        }
      }
  
      if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(' ') });
      }
  
      next();
    } catch (error) {
      console.error('Error validating order items:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  module.exports = validateOrderItems;