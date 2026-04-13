const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const errorHandler = require("./shared/middlewares/errorHandler");

const authRoutes = require("./auth/auth.routes");
const inventoryRoutes = require("./inventory/inventory.routes");
const progressRoutes = require("./progress/progress.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "🎮 ViBa API is running", version: "1.0.0", docs: "/api/docs" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/progress", progressRoutes);

app.use(errorHandler);

module.exports = app;
