const express = require("express");
const router = express.Router();
const {
  getAllClients,
  updateClient,
  deleteClient,
} = require("../controllers/adminController");
const ROLES = require("../config/roles");
const verifyJWT = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRole");

// Documentation for Swagger
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /api/admin/clients:
 *   get:
 *     tags: [Admin]
 *     summary: Get all clients
 *     description: Retrieves all clients with the role of 1000. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   businessType:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get("/clients", verifyJWT, verifyRoles(ROLES.Admin), getAllClients);

/**
 * @swagger
 * /api/admin/clients/{clientId}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a client
 *     description: Updates the details of a client by their ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *               businessType:
 *                 type: string
 *                 example: Updated Business Type
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 businessType:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/clients/:clientId",
  verifyJWT,
  verifyRoles(ROLES.Admin),
  updateClient
);

/**
 * @swagger
 * /api/admin/clients/{clientId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a client
 *     description: Deletes a client by their ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/clients/:clientId",
  verifyJWT,
  verifyRoles(ROLES.Admin),
  deleteClient
);

module.exports = router;
