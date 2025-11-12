import { getPool } from '../config/database.js';

export class TypeModel {
    static async register(logType, serverId, format, expires = 30, human_format = null) {
        const pool = getPool();
        const [result] = await pool.query(
            `INSERT INTO logscore_types (log_type, server_id, format, expires, human_format)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         format = VALUES(format),
         human_format = VALUES(human_format),
         expires = VALUES(expires),
         updated_at = CURRENT_TIMESTAMP`,
            [logType, serverId, format, expires, human_format]
        );
        return result;
    }

    static async findByServerAndType(serverId, logType) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_types WHERE server_id = ? AND log_type = ?',
            [serverId, logType]
        );
        return rows[0] || null;
    }

    static async findByServer(serverId) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_types WHERE server_id = ? ORDER BY log_type ASC',
            [serverId]
        );
        return rows;
    }

    static async findByServers(serverIds) {
        const pool = getPool();
        const placeholders = serverIds.map(() => '?').join(',');
        const [rows] = await pool.query(
            `SELECT * FROM logscore_types 
       WHERE server_id IN (${placeholders})
       ORDER BY server_id, log_type ASC`,
            serverIds
        );
        return rows;
    }

    static async findAll() {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_types ORDER BY server_id, log_type ASC'
        );
        return rows;
    }

    static async update(serverId, logType, updates) {
        const pool = getPool();
        const fields = [];
        const values = [];

        if (updates.format !== undefined) {
            fields.push('format = ?');
            values.push(updates.format);
        }
        if (updates.expires !== undefined) {
            fields.push('expires = ?');
            values.push(updates.expires);
        }
        if (updates.human_format !== undefined) {
            fields.push('human_format = ?');
            values.push(updates.human_format);
        }

        if (fields.length === 0) return false;

        values.push(serverId, logType);
        const [result] = await pool.query(
            `UPDATE logscore_types SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE server_id = ? AND log_type = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    static async delete(serverId, logType) {
        const pool = getPool();
        const [result] = await pool.query(
            'DELETE FROM logscore_types WHERE server_id = ? AND log_type = ?',
            [serverId, logType]
        );
        return result.affectedRows > 0;
    }
}
