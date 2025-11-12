import { ServerModel } from '../../models/server.model.js';
import { TypeModel } from '../../models/type.model.js';
import { TypeDataModel } from '../../models/typeData.model.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export default async function architectureRoutes(fastify, options) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    // Get full architecture
    fastify.get('/', async (request, reply) => {
        try {
            const servers = await ServerModel.findAll();
            const architecture = [];

            for (const server of servers) {
                const types = await TypeModel.findByServer(server.server_id);
                const typesWithData = [];

                for (const type of types) {
                    const dataFields = await TypeDataModel.findByServerAndType(
                        server.server_id,
                        type.log_type
                    );

                    typesWithData.push({
                        ...type,
                        dataFields
                    });
                }

                architecture.push({
                    ...server,
                    types: typesWithData
                });
            }

            return reply.code(200).send({ architecture });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Get servers with types
    fastify.get('/servers', async (request, reply) => {
        try {
            const servers = await ServerModel.findAll();
            const serversWithTypes = [];

            for (const server of servers) {
                const types = await TypeModel.findByServer(server.server_id);
                serversWithTypes.push({
                    ...server,
                    typesCount: types.length,
                    types
                });
            }

            return reply.code(200).send({ servers: serversWithTypes });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Get types for specific server
    fastify.get('/servers/:serverId/types', async (request, reply) => {
        try {
            const { serverId } = request.params;
            const types = await TypeModel.findByServer(serverId);

            return reply.code(200).send({ types });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Get data fields for specific type
    fastify.get('/types/:serverId/:logType/data', async (request, reply) => {
        try {
            const { serverId, logType } = request.params;
            const dataFields = await TypeDataModel.findByServerAndType(serverId, logType);

            return reply.code(200).send({ dataFields });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });
}
