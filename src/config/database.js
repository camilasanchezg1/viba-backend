const mongoose = require("mongoose");

// Cache the connection across serverless invocations
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("♻️  Reusing existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
