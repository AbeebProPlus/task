const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  confirmEmail,
  changePassword,
} = require("../controllers/clientController");
const verifyJWT = require("../middleware/verifyJwt");

// Documentation for Swagger
/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Client operations
 */

/**
 * @swagger
 * /api/client/register:
 *   post:
 *     tags: [Client]
 *     summary: Register a new user
 *     description: Registers a new user and sends a confirmation email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               businessType:
 *                 type: string
 *                 example: Retail
 *     responses:
 *       201:
 *         description: User successfully registered. A confirmation email has been sent.
 *       400:
 *         description: Bad request. Required fields may be missing.
 *       409:
 *         description: Conflict. Email already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/register", register);

/**
 * @swagger
 * /api/client/login:
 *   post:
 *     tags: [Client]
 *     summary: Login a user
 *     description: Logs in a user and returns an access token if credentials are valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful. Returns access token.
 *       400:
 *         description: Bad request. Email or password may be missing.
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", login);

/**
 * @swagger
 * /api/client/forgot-password:
 *   post:
 *     tags: [Client]
 *     summary: Request password reset
 *     description: Sends a password reset email with a link to reset the password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent if the email exists in the system.
 *       400:
 *         description: Bad request. Email may be missing.
 *       500:
 *         description: Internal server error.
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/client/reset-password:
 *   post:
 *     tags: [Client]
 *     summary: Reset user password
 *     description: Resets the user's password using a token and a new password.
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: newPassword
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newPassword:
 *               type: string
 *               example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Bad request. Token or new password may be missing.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/client/confirm-email:
 *   get:
 *     tags: [Client]
 *     summary: Confirm user email
 *     description: Confirms the user's email using a token sent to the user's email.
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email confirmed successfully.
 *       400:
 *         description: Bad request. Token may be missing or invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/confirm-email", confirmEmail);

/**
 * @swagger
 * /api/client/change-password:
 *   put:
 *     tags: [Client]
 *     summary: Change user password
 *     description: Changes the user's password after validating the old password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 60d5f78e0c1b2c001c8b4567
 *               oldPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Bad request. UserId, old password, or new password may be missing.
 *       401:
 *         description: Unauthorized. Old password does not match.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/change-password", verifyJWT, changePassword);

module.exports = router;
