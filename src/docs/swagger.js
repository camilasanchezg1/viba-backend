const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ViBa — VideoGame Backend",
      version: "1.0.0",
      description:
        "REST API para videojuegos. Módulos de autenticación, inventario y progreso de jugadores.",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Servidor activo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // ── Respuesta genérica ─────────────────────────────────────────
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "OK" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
          },
        },

        // ── Auth ───────────────────────────────────────────────────────
        RegisterBody: {
          type: "object",
          required: ["nickname", "email", "password"],
          properties: {
            nickname: { type: "string", example: "Player1", minLength: 3, maxLength: 20 },
            email: { type: "string", format: "email", example: "player@example.com" },
            password: { type: "string", format: "password", example: "secret123", minLength: 6 },
            birthdate: { type: "string", format: "date", example: "2000-01-15", nullable: true },
          },
        },
        LoginBody: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "player@example.com" },
            password: { type: "string", format: "password", example: "secret123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
            user: {
              type: "object",
              properties: {
                id: { type: "string", example: "664f1b2c3e4d5a6b7c8d9e0f" },
                nickname: { type: "string", example: "Player1" },
                email: { type: "string", example: "player@example.com" },
                birthdate: { type: "string", nullable: true, example: "2000-01-15" },
                score: { type: "number", example: 0 },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c3e4d5a6b7c8d9e0f" },
            nickname: { type: "string", example: "Player1" },
            email: { type: "string", example: "player@example.com" },
            birthdate: { type: "string", nullable: true, example: "2000-01-15" },
            score: { type: "number", example: 9 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ── Inventory ─────────────────────────────────────────────────
        AddItemBody: {
          type: "object",
          required: ["name", "type"],
          properties: {
            name: { type: "string", example: "Poción de vida" },
            type: { type: "string", enum: ["unique", "stackable"], example: "stackable" },
          },
        },
        InventoryItem: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c3e4d5a6b7c8d9e0f" },
            userId: { type: "string", example: "664f1b2c3e4d5a6b7c8d9e0a" },
            name: { type: "string", example: "Poción de vida" },
            quantity: { type: "number", example: 3 },
            type: { type: "string", enum: ["unique", "stackable"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ── Progress ──────────────────────────────────────────────────
        SubmitScoreBody: {
          type: "object",
          required: ["level", "score"],
          properties: {
            level: { type: "number", example: 2, minimum: 1 },
            score: { type: "number", example: 4, minimum: 0, maximum: 5 },
          },
        },
        LevelRecord: {
          type: "object",
          properties: {
            level: { type: "number", example: 1 },
            score: { type: "number", example: 5 },
            completedAt: { type: "string", format: "date-time" },
          },
        },
        ProgressResponse: {
          type: "object",
          properties: {
            currentLevel: { type: "number", example: 3 },
            levelHistory: {
              type: "array",
              items: { $ref: "#/components/schemas/LevelRecord" },
            },
            bestScoresByLevel: {
              type: "object",
              additionalProperties: { type: "number" },
              example: { "1": 5, "2": 4 },
            },
          },
        },
        SubmitScoreResponse: {
          type: "object",
          properties: {
            currentLevel: { type: "number", example: 3 },
            submittedRecord: { $ref: "#/components/schemas/LevelRecord" },
            bestScoresByLevel: {
              type: "object",
              additionalProperties: { type: "number" },
              example: { "1": 5, "2": 4 },
            },
            totalScore: { type: "number", example: 9 },
          },
        },
      },
    },
  },
  apis: ["./src/auth/auth.routes.js", "./src/inventory/inventory.routes.js", "./src/progress/progress.routes.js"],
};

module.exports = swaggerJsdoc(options);
