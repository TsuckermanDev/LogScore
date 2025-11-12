import { getPool } from '../config/database.js';

export class TypeDataModel {
    static async register(logType, serverId, typeData, dataType = 'string') {
        const pool = getPool();
        const [result] = await pool.query(
            `INSERT INTO logscore_types_data (log_type, server_id, type_data, data_type)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE data_type = VALUES(data_type)`,
            [logType, serverId, typeData, dataType]
        );
        return result;
    }

    static async findByServerAndType(serverId, logType) {
        const pool = getPool();
        const [rows] = await pool.query(
            `SELECT * FROM logscore_types_data 
       WHERE server_id = ? AND log_type = ?
       ORDER BY type_data ASC`,
            [serverId, logType]
        );
        return rows;
    }

    static async findAll() {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_types_data ORDER BY server_id, log_type, type_data ASC'
        );
        return rows;
    }

    static async delete(id) {
        const pool = getPool();
        const [result] = await pool.query(
            'DELETE FROM logscore_types_data WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}
