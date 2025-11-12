import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({
            error: 'Unauthorized',
            message: 'Authentication token is required'
        });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
        return reply.code(401).send({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }

    request.user = decoded;
};
