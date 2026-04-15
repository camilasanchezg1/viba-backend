require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();

// 🚀 SIEMPRE escuchar (Railway lo necesita)
app.listen(PORT, () => {
  console.log(`🎮 ViBa server running on port ${PORT}`);
});

module.exports = app;
