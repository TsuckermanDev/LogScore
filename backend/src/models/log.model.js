import { getPool } from '../config/database.js';

export class LogModel {
    static async create(logType, serverId, datetime, expiresAt, data) {
        const pool = getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Insert log
            const [logResult] = await connection.query(
                `INSERT INTO logscore_logs (log_type, server_id, datetime, expires_at)
         VALUES (?, ?, ?, ?)`,
                [logType, serverId, datetime, expiresAt]
            );

            const logId = logResult.insertId;

            // Insert data entries
            if (data && Object.keys(data).length > 0) {
                const dataValues = Object.entries(data).map(([key, value]) => [
                    logId,
                    key,
                    typeof value === 'object' ? JSON.stringify(value) : String(value)
                ]);

                await connection.query(
                    'INSERT INTO logscore_data (log_id, data_key, data_value) VALUES ?',
                    [dataValues]
                );
            }

            await connection.commit();
            return logId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async createBatch(logs) {
        const pool = getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const logIds = [];
            for (const log of logs) {
                const [logResult] = await connection.query(
                    `INSERT INTO logscore_logs (log_type, server_id, datetime, expires_at)
           VALUES (?, ?, ?, ?)`,
                    [log.logType, log.serverId, log.datetime, log.expiresAt]
                );

                const logId = logResult.insertId;
                logIds.push(logId);

                if (log.data && Object.keys(log.data).length > 0) {
                    const dataValues = Object.entries(log.data).map(([key, value]) => [
                        logId,
                        key,
                        typeof value === 'object' ? JSON.stringify(value) : String(value)
                    ]);

                    await connection.query(
                        'INSERT INTO logscore_data (log_id, data_key, data_value) VALUES ?',
                        [dataValues]
                    );
                }
            }

            await connection.commit();
            return logIds;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findById(id) {
        const pool = getPool();
        const [logs] = await pool.query(
            `SELECT l.*, 
              GROUP_CONCAT(CONCAT(d.data_key, ':', d.data_value) SEPARATOR '||') as data_raw
       FROM logscore_logs l
       LEFT JOIN logscore_data d ON l.id = d.log_id
       WHERE l.id = ?
       GROUP BY l.id`,
            [id]
        );

        if (logs.length === 0) return null;

        return this._parseLogData(logs[0]);
    }

    static async search(filters) {
        const pool = getPool();
        const {
            serverIds = [],
            logTypes = [],
            dateFrom,
            dateTo,
            dataFilters = {},
            limit = 50,
            offset = 0,
            orderBy = 'datetime',
            orderDir = 'DESC'
        } = filters;

        let query = `
      SELECT l.id, l.log_type, l.server_id, l.datetime, l.expires_at,
             GROUP_CONCAT(CONCAT(d.data_key, ':', d.data_value) SEPARATOR '||') as data_raw
      FROM logscore_logs l
      LEFT JOIN logscore_data d ON l.id = d.log_id
      WHERE 1=1
    `;

        const params = [];

        // Server filter
        if (serverIds.length > 0) {
            const placeholders = serverIds.map(() => '?').join(',');
            query += ` AND l.server_id IN (${placeholders})`;
            params.push(...serverIds);
        }

        // Log type filter
        if (logTypes.length > 0) {
            const placeholders = logTypes.map(() => '?').join(',');
            query += ` AND l.log_type IN (${placeholders})`;
            params.push(...logTypes);
        }

        // Date range filter
        if (dateFrom) {
            query += ' AND l.datetime >= ?';
            params.push(dateFrom);
        }
        if (dateTo) {
            query += ' AND l.datetime <= ?';
            params.push(dateTo);
        }

        // Data filters
        if (Object.keys(dataFilters).length > 0) {
            for (const [key, filter] of Object.entries(dataFilters)) {
                const { operator, value, value2 } = filter;

                switch (operator) {
                    case 'equals':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? AND data_value = ?
            )`;
                        params.push(key, value);
                        break;
                    case 'contains':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? AND data_value LIKE ?
            )`;
                        params.push(key, `%${value}%`);
                        break;
                    case 'starts_with':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? AND data_value LIKE ?
            )`;
                        params.push(key, `${value}%`);
                        break;
                    case 'ends_with':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? AND data_value LIKE ?
            )`;
                        params.push(key, `%${value}`);
                        break;
                    case 'greater':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? AND CAST(data_value AS DECIMAL(20,5)) > ?
            )`;
                        params.push(key, value);
                        break;
                    case 'less':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? AND CAST(data_value AS DECIMAL(20,5)) < ?
            )`;
                        params.push(key, value);
                        break;
                    case 'between':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? 
              AND CAST(data_value AS DECIMAL(20,5)) BETWEEN ? AND ?
            )`;
                        params.push(key, value, value2);
                        break;
                }
            }
        }

        query += ' GROUP BY l.id';

        // Order
        const validOrderBy = ['datetime', 'id', 'log_type', 'server_id'];
        const validOrderDir = ['ASC', 'DESC'];
        if (validOrderBy.includes(orderBy) && validOrderDir.includes(orderDir.toUpperCase())) {
            query += ` ORDER BY l.${orderBy} ${orderDir}`;
        }

        // Pagination
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [logs] = await pool.query(query, params);

        return logs.map(log => this._parseLogData(log));
    }

    static async count(filters) {
        const pool = getPool();
        const {
            serverIds = [],
            logTypes = [],
            dateFrom,
            dateTo,
            dataFilters = {}
        } = filters;

        let query = 'SELECT COUNT(DISTINCT l.id) as count FROM logscore_logs l';

        if (Object.keys(dataFilters).length > 0) {
            query += ' LEFT JOIN logscore_data d ON l.id = d.log_id';
        }

        query += ' WHERE 1=1';
        const params = [];

        if (serverIds.length > 0) {
            const placeholders = serverIds.map(() => '?').join(',');
            query += ` AND l.server_id IN (${placeholders})`;
            params.push(...serverIds);
        }

        if (logTypes.length > 0) {
            const placeholders = logTypes.map(() => '?').join(',');
            query += ` AND l.log_type IN (${placeholders})`;
            params.push(...logTypes);
        }

        if (dateFrom) {
            query += ' AND l.datetime >= ?';
            params.push(dateFrom);
        }
        if (dateTo) {
            query += ' AND l.datetime <= ?';
            params.push(dateTo);
        }

        if (Object.keys(dataFilters).length > 0) {
            for (const [key, filter] of Object.entries(dataFilters)) {
                const { operator, value, value2 } = filter;

                switch (operator) {
                    case 'equals':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? AND data_value = ?
            )`;
                        params.push(key, value);
                        break;
                    case 'contains':
                        query += ` AND EXISTS (
              SELECT 1 FROM logscore_data 
              WHERE log_id = l.id AND data_key = ? AND data_value LIKE ?
            )`;
                        params.push(key, `%${value}%`);
                        break;
                    // ... другие операторы аналогично
                }
            }
        }

        const [result] = await pool.query(query, params);
        return result[0].count;
    }

    static async deleteExpired() {
        const pool = getPool();
        const [result] = await pool.query(
            'DELETE FROM logscore_logs WHERE expires_at < NOW()'
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const pool = getPool();
        const [result] = await pool.query(
            'DELETE FROM logscore_logs WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static _parseLogData(log) {
        const data = {};
        if (log.data_raw) {
            const pairs = log.data_raw.split('||');
            for (const pair of pairs) {
                const colonIndex = pair.indexOf(':');
                if (colonIndex > 0) {
                    const key = pair.substring(0, colonIndex);
                    const value = pair.substring(colonIndex + 1);
                    data[key] = value;
                }
            }
        }

        return {
            id: log.id,
            logType: log.log_type,
            serverId: log.server_id,
            datetime: log.datetime,
            expiresAt: log.expires_at,
            createdAt: log.created_at,
            data
        };
    }
}
