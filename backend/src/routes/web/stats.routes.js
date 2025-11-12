import { StatsService } from '../../services/stats.service.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export default async function statsRoutes(fastify, options) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    // Get count by parameters
    fastify.get('/count', async (request, reply) => {
        try {
            const { serverIds, logTypes, dateFrom, dateTo } = request.query;

            const filters = {
                serverIds: serverIds ? serverIds.split(',') : [],
                logTypes: logTypes ? logTypes.split(',') : [],
                dateFrom,
                dateTo
            };

            const count = await StatsService.getCountByParams(filters);
            return reply.code(200).send({ count });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Get timeline data
    fastify.get('/timeline', async (request, reply) => {
        try {
            const { serverIds, logTypes, dateFrom, dateTo, groupBy = 'day' } = request.query;

            const filters = {
                serverIds: serverIds ? serverIds.split(',') : [],
                logTypes: logTypes ? logTypes.split(',') : [],
                dateFrom,
                dateTo,
                groupBy
            };

            const timeline = await StatsService.getTimeline(filters);
            return reply.code(200).send({ timeline });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Get distribution by log type
    fastify.get('/distribution/type', async (request, reply) => {
        try {
            const { serverIds, logTypes, dateFrom, dateTo, limit = 10 } = request.query;

            const filters = {
                serverIds: serverIds ? serverIds.split(',') : [],
                logTypes: logTypes ? logTypes.split(',') : [],
                dateFrom,
                dateTo,
                limit: parseInt(limit)
            };

            const distribution = await StatsService.getDistributionByType(filters);
            return reply.code(200).send({ distribution });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });

    // Get distribution by server
    fastify.get('/distribution/server', async (request, reply) => {
        try {
            const { serverIds, logTypes, dateFrom, dateTo } = request.query;

            const filters = {
                serverIds: serverIds ? serverIds.split(',') : [],
                logTypes: logTypes ? logTypes.split(',') : [],
                dateFrom,
                dateTo
            };

            const distribution = await StatsService.getDistributionByServer(filters);
            return reply.code(200).send({ distribution });
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    });
}
