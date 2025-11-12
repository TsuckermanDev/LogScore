import { TypeModel } from '../models/type.model.js';
import { ServerModel } from '../models/server.model.js';

export class TypeService {
    static async register(logType, serverId, format, expires = 30, human_format = null) {
        // Verify server exists
        const serverExists = await ServerModel.exists(serverId);
        if (!serverExists) {
            throw new Error('Server not found. Register server first.');
        }

        if (!logType || !format) {
            throw new Error('Log type and format are required');
        }

        await TypeModel.register(logType, serverId, format, expires, human_format);
        return { success: true, logType, serverId };
    }

    static async getTypes(serverId = null) {
        if (serverId) {
            return await TypeModel.findByServer(serverId);
        }
        return await TypeModel.findAll();
    }

    static async getTypesByServers(serverIds) {
        return await TypeModel.findByServers(serverIds);
    }

    static async updateType(serverId, logType, updates) {
        const updated = await TypeModel.update(serverId, logType, updates);
        if (!updated) {
            throw new Error('Log type not found');
        }
        return { success: true };
    }

    static async deleteType(serverId, logType) {
        const deleted = await TypeModel.delete(serverId, logType);
        if (!deleted) {
            throw new Error('Log type not found');
        }
        return { success: true };
    }
}
