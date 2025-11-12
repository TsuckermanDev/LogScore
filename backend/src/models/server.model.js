import { getPool } from '../config/database.js';

export class ServerModel {
    static async register(serverId, serverName) {
        const pool = getPool();
        const [result] = await pool.query(
            `INSERT INTO logscore_servers (server_id, server_name)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE server_name = VALUES(server_name), updated_at = CURRENT_TIMESTAMP`,
            [serverId, serverName]
        );
        return result;
    }

    static async findById(serverId) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_servers WHERE server_id = ?',
            [serverId]
        );
        return rows[0] || null;
    }

    static async findAll() {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_servers ORDER BY server_name ASC'
        );
        return rows;
    }

    static async exists(serverId) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM logscore_servers WHERE server_id = ?',
            [serverId]
        );
        return rows[0].count > 0;
    }

    static async delete(serverId) {
        const pool = getPool();
        const [result] = await pool.query(
            'DELETE FROM logscore_servers WHERE server_id = ?',
            [serverId]
        );
        return result.affectedRows > 0;
    }
}
