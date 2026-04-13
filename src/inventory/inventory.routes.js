const express = require("express");
const router = express.Router();
const inventoryController = require("./inventory.controller");
const { protect } = require("../auth/auth.middleware");

/**
 * @openapi
 * tags:
 *   name: Inventory
 *   description: Gestión del inventario de ítems del jugador
 */

// All inventory routes require authentication
router.use(protect);

/**
 * @openapi
 * /api/inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: Obtener el inventario del jugador
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [unique, stackable]
 *         description: Filtrar por tipo de ítem (opcional)
 *     responses:
 *       200:
 *         description: Lista de ítems en el inventario
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/InventoryItem'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", inventoryController.getInventory);

/**
 * @openapi
 * /api/inventory/add:
 *   post:
 *     tags: [Inventory]
 *     summary: Agregar un ítem al inventario
 *     description: |
 *       - **unique**: siempre crea un documento nuevo, incluso si ya existe uno con el mismo nombre.
 *       - **stackable**: incrementa `quantity` si ya existe uno con ese nombre; si no, lo crea.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemBody'
 *     responses:
 *       201:
 *         description: Ítem agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Faltan campos requeridos o tipo inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/add", inventoryController.addItem);

/**
 * @openapi
 * /api/inventory/{itemId}:
 *   delete:
 *     tags: [Inventory]
 *     summary: Eliminar o reducir un ítem del inventario
 *     description: |
 *       - **stackable** con `quantity > 1`: reduce la cantidad en 1.
 *       - **unique** o **stackable** con `quantity === 1`: elimina el documento completo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ítem a eliminar
 *     responses:
 *       200:
 *         description: Ítem eliminado o cantidad reducida
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/InventoryItem'
 *                         - type: "null"
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Ítem no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:itemId", inventoryController.removeItem);

module.exports = router;
