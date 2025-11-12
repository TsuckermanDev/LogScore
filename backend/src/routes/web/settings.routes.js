import { TypeModel } from '../../models/type.model.js';
import { ServerModel } from '../../models/server.model.js'; // ДОБАВЬ!
import { authMiddleware } from '../../middleware/auth.middleware.js';

export default async function settingsRoutes(fastify, options) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    // Get expiration settings
    fastify.get('/expiration', async (request, reply) => {
        try {
            const types = await TypeModel.findAll();
            const servers = await ServerModel.getAll(); // ДОБАВЬ!

            // Создай map серверов для быстрого доступа
            const serverMap = {};
            servers.forEach(s => {
                serverMap[s.server_id] = s.server_name;
            });

            const settings = types.map(type => ({
                server_id: type.server_id,
                server_name: serverMap[type.server_id] || type.server_id, // ДОБАВЬ!
                log_type: type.log_type,
                expires: type.expires
            }));

            return reply.code(200).send({ settings });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Update expiration for specific type
    fastify.put('/expiration', async (request, reply) => {
        try {
            const { server_id, log_type, expires } = request.body;

            if (!server_id || !log_type || expires === undefined) {
                return reply.code(400).send({
                    error: 'Bad Request',
                    message: 'server_id, log_type, and expires are required'
                });
            }

            const updated = await TypeModel.update(server_id, log_type, { expires });

            if (!updated) {
                return reply.code(404).send({ error: 'Log type not found' });
            }

            return reply.code(200).send({ success: true });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });
}
