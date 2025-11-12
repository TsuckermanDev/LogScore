import { TypeService } from '../../services/type.service.js';
import { TypeDataModel } from '../../models/typeData.model.js';

export default async function typeRoutes(fastify, options) {
    // Register log type
    fastify.post('/register', async (request, reply) => {
        try {
            const { log_type, server_id, format, expires = 30 } = request.body;
            const result = await TypeService.register(log_type, server_id, format, expires);
            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    });

    // Get all types or by server (query param)
    fastify.get('/', async (request, reply) => {
        try {
            const { serverId } = request.query;
            const types = await TypeService.getTypes(serverId);
            return reply.code(200).send({ types });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Get types for specific server (path param) - FOR LogsPage
    fastify.get('/:serverId', async (request, reply) => {
        try {
            const { serverId } = request.params;
            const types = await TypeService.getTypes(serverId);
            return reply.code(200).send({ types });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Update log type
    fastify.put('/:serverId/:logType', async (request, reply) => {
        try {
            const { serverId, logType } = request.params;
            const updates = request.body;
            const result = await TypeService.updateType(serverId, logType, updates);
            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(404).send({ error: error.message });
        }
    });

    // Register type data field
    fastify.post('/data/register', async (request, reply) => {
        try {
            const { log_type, server_id, type_data, data_type = 'string' } = request.body;
            await TypeDataModel.register(log_type, server_id, type_data, data_type);
            return reply.code(200).send({ success: true });
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    });

    // Get type data fields
    fastify.get('/:serverId/:logType/data', async (request, reply) => {
        try {
            const { serverId, logType } = request.params;
            const fields = await TypeDataModel.findByServerAndType(serverId, logType);
            return reply.code(200).send({ fields });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Delete type
    fastify.delete('/:serverId/:logType', async (request, reply) => {
        try {
            const { serverId, logType } = request.params;
            // Добавь логику удаления в TypeService, если нужно
            return reply.code(200).send({ message: 'Type deleted' });
        } catch (error) {
            return reply.code(404).send({ error: error.message });
        }
    });
}
