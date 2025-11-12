import { LogService } from '../../services/log.service.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export default async function webLogsRoutes(fastify, options) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    // Search logs with formatting
    fastify.get('/', async (request, reply) => {
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
                orderDir = 'DESC',
                format = 'raw' // raw or human
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

            // Format logs if human-readable requested
            if (format === 'human') {
                const formattedLogs = await Promise.all(
                    result.logs.map(async (log) => {
                        const formatted = await LogService.formatLog(log);
                        return {
                            ...log,
                            formatted
                        };
                    })
                );
                result.logs = formattedLogs;
            }

            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    });

    // Export logs
    fastify.get('/export', async (request, reply) => {
        try {
            const {
                serverIds,
                logTypes,
                dateFrom,
                dateTo,
                filters,
                exportFormat = 'json' // json or csv
            } = request.query;

            const searchFilters = {
                serverIds: serverIds ? serverIds.split(',') : [],
                logTypes: logTypes ? logTypes.split(',') : [],
                dateFrom,
                dateTo,
                dataFilters: filters ? JSON.parse(filters) : {},
                limit: 10000, // Max export limit
                offset: 0,
                orderBy: 'datetime',
                orderDir: 'DESC'
            };

            const result = await LogService.searchLogs(searchFilters);

            if (exportFormat === 'csv') {
                // Convert to CSV
                let csv = 'ID,Server,Type,DateTime,Data\n';
                for (const log of result.logs) {
                    const dataStr = JSON.stringify(log.data).replace(/"/g, '""');
                    csv += `${log.id},${log.serverId},${log.logType},${log.datetime},"${dataStr}"\n`;
                }

                reply.header('Content-Type', 'text/csv');
                reply.header('Content-Disposition', 'attachment; filename=logs.csv');
                return reply.send(csv);
            } else {
                // JSON format
                reply.header('Content-Type', 'application/json');
                reply.header('Content-Disposition', 'attachment; filename=logs.json');
                return reply.send(result.logs);
            }
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    });
}
