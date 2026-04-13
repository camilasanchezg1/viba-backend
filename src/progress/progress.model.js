const mongoose = require("mongoose");

const levelRecordSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
      min: 1,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    // Full history — one entry per attempt (multiple entries per level are allowed)
    levelHistory: {
      type: [levelRecordSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
