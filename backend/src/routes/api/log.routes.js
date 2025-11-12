import { LogService } from '../../services/log.service.js';
import { createLogSchema, createBatchLogsSchema, searchLogsSchema } from '../../schemas/log.schema.js';

export default async function logRoutes(fastify, options) {
// Create single log
fastify.post('/', {
    schema: createLogSchema
}, async (request, reply) => {
    try {
        const { 
            server_id, 
            log_type, 
            datetime, 
            data = {} 
        } = request.body;
        
        // Конвертируем datetime в MySQL формат
        let mysqlDatetime;
        if (datetime) {
            const date = new Date(datetime);
            mysqlDatetime = date.toISOString().slice(0, 19).replace('T', ' ');
        } else {
            const now = new Date();
            mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
        }
        
        const result = await LogService.createLog(log_type, server_id, mysqlDatetime, data);
        return reply.code(201).send(result);
    } catch (error) {
        return reply.code(400).send({ error: error.message });
    }
});

    // Create batch logs
    fastify.post('/batch', {
        schema: createBatchLogsSchema
    }, async (request, reply) => {
        try {
            const { logs } = request.body;
            const result = await LogService.createBatchLogs(logs);
            return reply.code(201).send(result);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    });

    // Search logs
    fastify.get('/', {
        schema: searchLogsSchema
    }, async (request, reply) => {
        try {
            const {
                serverIds,
                logTypes,
                dateFrom,
                dateTo,
                filters,
                limit = 50,
                offset = 0,
                orderBy = 'datetime',
                orderDir = 'DESC'
            } = request.query;

            const searchFilters = {
                serverIds: serverIds ? serverIds.split(',') : [],
                logTypes: logTypes ? logTypes.split(',') : [],
                dateFrom,
                dateTo,
                dataFilters: filters ? JSON.parse(filters) : {},
                limit: parseInt(limit),
                offset: parseInt(offset),
                orderBy,
                orderDir
            };

            const result = await LogService.searchLogs(searchFilters);
            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    });

    // Get log by ID
    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const log = await LogService.getLogById(parseInt(id));
            return reply.code(200).send(log);
        } catch (error) {
            return reply.code(404).send({ error: error.message });
        }
    });

    // Delete log
    fastify.delete('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const result = await LogService.deleteLog(parseInt(id));
            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(404).send({ error: error.message });
        }
    });
}
