import { ServerModel } from '../models/server.model.js';

export class ServerService {
    static async register(serverId, serverName) {
        if (!serverId || !serverName) {
            throw new Error('Server ID and name are required');
        }

        await ServerModel.register(serverId, serverName);
        return { success: true, serverId, serverName };
    }

    static async getServer(serverId) {
        const server = await ServerModel.findById(serverId);
        if (!server) {
            throw new Error('Server not found');
        }
        return server;
    }

    static async getAllServers() {
        return await ServerModel.findAll();
    }

    static async deleteServer(serverId) {
        const deleted = await ServerModel.delete(serverId);
        if (!deleted) {
            throw new Error('Server not found');
        }
        return { success: true };
    }
}
