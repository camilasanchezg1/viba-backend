require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Conectar DB
connectDB();

// 🚀 IMPORTANTE: escuchar en Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎮 ViBa server running on port ${PORT}`);
});
