/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates user by email and password, returns a JWT and sets a cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *     responses:
 *       200:
 *         description: Login successful or terms acceptance required
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials. Please try again
 *       500:
 *         description: Server error
 */
