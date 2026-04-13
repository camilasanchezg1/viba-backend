const express = require("express");
const router = express.Router();
const progressController = require("./progress.controller");
const { protect } = require("../auth/auth.middleware");

/**
 * @openapi
 * tags:
 *   name: Progress
 *   description: Progreso del jugador por niveles
 */

// All progress routes require authentication
router.use(protect);

/**
 * @openapi
 * /api/progress:
 *   get:
 *     tags: [Progress]
 *     summary: Obtener el progreso del jugador
 *     description: Retorna el nivel actual, el historial completo de intentos y la mejor puntuación por nivel.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progreso del jugador
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProgressResponse'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", progressController.getProgress);

/**
 * @openapi
 * /api/progress/submit:
 *   post:
 *     tags: [Progress]
 *     summary: Enviar puntuación de un nivel
 *     description: |
 *       El cliente envía el nivel completado y la puntuación obtenida (0–5).
 *       - Si `score > 0` y `level === currentLevel`, el jugador avanza al siguiente nivel automáticamente.
 *       - Si `score === 0` o el nivel no es el actual, solo se registra en el historial.
 *       - El `score` total del usuario se recalcula como la suma de las mejores puntuaciones por nivel.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitScoreBody'
 *     responses:
 *       200:
 *         description: Puntuación registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SubmitScoreResponse'
 *       400:
 *         description: Campos faltantes o score fuera de rango (0–5)
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
router.post("/submit", progressController.submitLevelScore);

module.exports = router;
