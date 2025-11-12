import { ServerService } from '../../services/server.service.js';
import { TypeService } from '../../services/type.service.js';
import { TypeDataModel } from '../../models/typeData.model.js';
import { registerServerSchema, getServerSchema } from '../../schemas/server.schema.js';

export default async function serverRoutes(fastify, options) {
    // Register server
    fastify.post('/register', {
        schema: registerServerSchema
    }, async (request, reply) => {
        try {
            const { server_id, server_name } = request.body;
            const result = await ServerService.register(server_id, server_name);
            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    });

    // Get all servers WITH their types AND dataFields (for Architecture page)
    fastify.get('/', async (request, reply) => {
        try {
            const servers = await ServerService.getAllServers();
            
            // For each server, fetch its types and data fields
            const serversWithTypes = await Promise.all(
                servers.map(async (server) => {
                    try {
                        const types = await TypeService.getTypes(server.server_id);
                        
                        // For each type, fetch its data fields
                        const typesWithFields = await Promise.all(
                            types.map(async (type) => {
                                try {
                                    const fields = await TypeDataModel.findByServerAndType(server.server_id, type.log_type);
                                    return {
                                        ...type,
                                        dataFields: fields || []
                                    };
                                } catch (error) {
                                    console.error(`Error loading fields for ${server.server_id}/${type.log_type}:`, error);
                                    return {
                                        ...type,
                                        dataFields: []
                                    };
                                }
                            })
                        );
                        
                        return {
                            ...server,
                            types: typesWithFields
                        };
                    } catch (error) {
                        console.error(`Error loading types for server ${server.server_id}:`, error);
                        return {
                            ...server,
                            types: []
                        };
                    }
                })
            );
            
            return reply.code(200).send({ servers: serversWithTypes });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Get specific server
    fastify.get('/:serverId', {
        schema: getServerSchema
    }, async (request, reply) => {
        try {
            const { serverId } = request.params;
            const server = await ServerService.getServer(serverId);
            return reply.code(200).send(server);
        } catch (error) {
            return reply.code(404).send({ error: error.message });
        }
    });

    // Delete server
    fastify.delete('/:serverId', {
        schema: getServerSchema
    }, async (request, reply) => {
        try {
            const { serverId } = request.params;
            const result = await ServerService.deleteServer(serverId);
            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(404).send({ error: error.message });
        }
    });
}
