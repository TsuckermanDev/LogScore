import { ApiKeyModel } from '../models/apiKey.model.js';

export const apiKeyMiddleware = async (request, reply) => {
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
        return reply.code(401).send({
            error: 'Unauthorized',
            message: 'API key is required'
        });
    }

    const isValid = await ApiKeyModel.isValid(apiKey);

    if (!isValid) {
        return reply.code(401).send({
            error: 'Unauthorized',
            message: 'Invalid or expired API key'
        });
    }

    // Update usage
    await ApiKeyModel.updateUsage(apiKey);

    request.apiKey = apiKey;
};
