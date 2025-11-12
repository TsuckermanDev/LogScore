export const createLogSchema = {
    body: {
        type: 'object',
        required: ['server_id', 'log_type'],
        properties: {
            server_id: { type: 'string', maxLength: 64 },
            log_type: { type: 'string', maxLength: 128 },
            datetime: { type: 'string' }, // ISO datetime
            data: { type: 'object' }
        }
    }
};

export const createBatchLogsSchema = {
    body: {
        type: 'object',
        required: ['logs'],
        properties: {
            logs: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['server_id', 'log_type', 'datetime'],
                    properties: {
                        server_id: { type: 'string', maxLength: 64 },
                        log_type: { type: 'string', maxLength: 128 },
                        datetime: { type: 'string' },
                        data: { type: 'object' }
                    }
                }
            }
        }
    }
};

export const searchLogsSchema = {
    querystring: {
        type: 'object',
        properties: {
            serverIds: { type: 'string' }, // comma-separated
            logTypes: { type: 'string' }, // comma-separated
            dateFrom: { type: 'string' },
            dateTo: { type: 'string' },
            filters: { type: 'string' }, // JSON string
            limit: { type: 'integer', minimum: 1, maximum: 1000, default: 50 },
            offset: { type: 'integer', minimum: 0, default: 0 },
            orderBy: { type: 'string', enum: ['datetime', 'id', 'log_type', 'server_id'], default: 'datetime' },
            orderDir: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' }
        }
    }
};
