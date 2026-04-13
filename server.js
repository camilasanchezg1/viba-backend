require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Connect to DB (cached internally for serverless environments)
connectDB();

// Local development: start the server normally
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🎮 ViBa server running on port ${PORT}`);
  });
}

// Vercel serverless: export the app as the handler
module.exports = app;
