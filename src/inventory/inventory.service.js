const InventoryItem = require("./inventory.model");
const { ITEM_TYPES } = require("./inventory.model");

/**
 * Get all inventory items for a user.
 * Optionally filter by type.
 */
const getUserInventory = async (userId, type = null) => {
  const query = { userId };
  if (type) query.type = type;
  return InventoryItem.find(query).sort({ createdAt: -1 });
};

/**
 * Add an item to the user's inventory.
 *
 * - UNIQUE: always creates a new document (even if the user already has one with the same name)
 * - STACKABLE: finds existing item by name and increments quantity, or creates a new one
 */
const addItem = async (userId, { name, type }) => {
  if (type === ITEM_TYPES.UNIQUE) {
    // Unique items always become separate documents
    const item = await InventoryItem.create({ userId, name, type, quantity: 1 });
    return item;
  }

  if (type === ITEM_TYPES.STACKABLE) {
    // Stack on top of existing item with the same name, or create a new one
    const existing = await InventoryItem.findOne({ userId, name, type: ITEM_TYPES.STACKABLE });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return existing;
    }

    const item = await InventoryItem.create({ userId, name, type, quantity: 1 });
    return item;
  }

  throw Object.assign(new Error("Invalid item type"), { statusCode: 400 });
};

/**
 * Remove an item from the inventory.
 * For stackable items with quantity > 1, decrements by 1.
 * For unique items or stackable with quantity === 1, deletes the document.
 */
const removeItem = async (userId, itemId) => {
  const item = await InventoryItem.findOne({ _id: itemId, userId });
  if (!item) throw Object.assign(new Error("Item not found"), { statusCode: 404 });

  if (item.type === ITEM_TYPES.STACKABLE && item.quantity > 1) {
    item.quantity -= 1;
    await item.save();
    return item;
  }

  await item.deleteOne();
  return null;
};

module.exports = { getUserInventory, addItem, removeItem };
