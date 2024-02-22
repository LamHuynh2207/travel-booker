import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/getCurrentUser:
 *   get:
 *     summary: Get current user
 *     description: Retrieve information about the currently logged-in user.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    id: '123',
    name: 'John Doe',
  });
};

export default handler;