import { AuthService } from '../../services/auth.service.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export default async function authRoutes(fastify, options) {
    // Login
    fastify.post('/login', async (request, reply) => {
        try {
            const { login, password } = request.body;

            if (!login || !password) {
                return reply.code(400).send({
                    error: 'Bad Request',
                    message: 'Login and password are required'
                });
            }

            const result = await AuthService.login(login, password);
            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: error.message
            });
        }
    });

    // Verify token
    fastify.get('/verify', {
        preHandler: authMiddleware
    }, async (request, reply) => {
        try {
            const user = await AuthService.verify(request.user);
            return reply.code(200).send({ user });
        } catch (error) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: error.message
            });
        }
    });

    // Logout (client-side only, just for consistency)
    fastify.post('/logout', {
        preHandler: authMiddleware
    }, async (request, reply) => {
        return reply.code(200).send({ success: true });
    });
}
