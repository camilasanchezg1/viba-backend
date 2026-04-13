const mongoose = require("mongoose");

const ITEM_TYPES = {
  UNIQUE: "unique",
  STACKABLE: "stackable",
};

const inventoryItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },
    type: {
      type: String,
      enum: {
        values: Object.values(ITEM_TYPES),
        message: "Type must be 'unique' or 'stackable'",
      },
      required: [true, "Item type is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
module.exports.ITEM_TYPES = ITEM_TYPES;
