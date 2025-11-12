export const registerServerSchema = {
    body: {
        type: 'object',
        required: ['server_id', 'server_name'],
        properties: {
            server_id: { type: 'string', minLength: 1, maxLength: 64 },
            server_name: { type: 'string', minLength: 1, maxLength: 255 }
        }
    }
};

export const getServerSchema = {
    params: {
        type: 'object',
        required: ['serverId'],
        properties: {
            serverId: { type: 'string' }
        }
    }
};
