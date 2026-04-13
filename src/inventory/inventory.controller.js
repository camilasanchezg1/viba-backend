const inventoryService = require("./inventory.service");
const { success, error } = require("../shared/utils/response");

const getInventory = async (req, res, next) => {
  try {
    const { type } = req.query;
    const items = await inventoryService.getUserInventory(req.user._id, type);
    return success(res, items, "Inventory retrieved");
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return error(res, "name and type are required", 400);
    }

    const item = await inventoryService.addItem(req.user._id, { name, type });
    return success(res, item, "Item added to inventory", 201);
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const result = await inventoryService.removeItem(req.user._id, req.params.itemId);

    if (result === null) {
      return success(res, null, "Item removed from inventory");
    }

    return success(res, result, "Item quantity decreased");
  } catch (err) {
    next(err);
  }
};

module.exports = { getInventory, addItem, removeItem };
