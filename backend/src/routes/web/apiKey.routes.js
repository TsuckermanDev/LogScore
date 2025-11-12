import { ApiKeyModel } from '../../models/apiKey.model.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export default async function apiKeyRoutes(fastify, options) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    // Get all API keys
    fastify.get('/', async (request, reply) => {
        try {
            const keys = await ApiKeyModel.findAll();

            // НЕ маскируем ключи - frontend сам решит показывать или нет
            return reply.code(200).send({ keys });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Create new API key
    fastify.post('/', async (request, reply) => {
        try {
            const { expires_at = null } = request.body;

            const apiKey = await ApiKeyModel.create(expires_at);

            return reply.code(201).send({
                success: true,
                api_key: apiKey,
                message: 'API key created. Save it securely, it will not be shown again.'
            });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Delete API key
    fastify.delete('/:apiKey', async (request, reply) => {
        try {
            const { apiKey } = request.params;
            const deleted = await ApiKeyModel.delete(apiKey);

            if (!deleted) {
                return reply.code(404).send({ error: 'API key not found' });
            }

            return reply.code(200).send({ success: true });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Update API key expiration
    fastify.put('/:apiKey', async (request, reply) => {
        try {
            const { apiKey } = request.params;
            const { expires_at } = request.body;

            const updated = await ApiKeyModel.updateExpiration(apiKey, expires_at);

            if (!updated) {
                return reply.code(404).send({ error: 'API key not found' });
            }

            return reply.code(200).send({ success: true });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });
}
