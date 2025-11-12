import { getPool } from '../config/database.js';

export class StatsService {
    static async getCountByParams(filters) {
        const pool = getPool();
        const {
            serverIds = [],
            logTypes = [],
            dateFrom,
            dateTo
        } = filters;

        let query = 'SELECT COUNT(*) as count FROM logscore_logs WHERE 1=1';
        const params = [];

        if (serverIds.length > 0) {
            const placeholders = serverIds.map(() => '?').join(',');
            query += ` AND server_id IN (${placeholders})`;
            params.push(...serverIds);
        }

        if (logTypes.length > 0) {
            const placeholders = logTypes.map(() => '?').join(',');
            query += ` AND log_type IN (${placeholders})`;
            params.push(...logTypes);
        }

        if (dateFrom) {
            query += ' AND datetime >= ?';
            params.push(dateFrom);
        }

        if (dateTo) {
            query += ' AND datetime <= ?';
            params.push(dateTo);
        }

        const [result] = await pool.query(query, params);
        return result[0].count;
    }

    static async getTimeline(filters) {
        const pool = getPool();
        const {
            serverIds = [],
            logTypes = [],
            dateFrom,
            dateTo,
            groupBy = 'hour' // hour, day, week, month
        } = filters;

        let dateFormat;
        switch (groupBy) {
            case 'hour':
                dateFormat = '%Y-%m-%d %H:00:00';
                break;
            case 'day':
                dateFormat = '%Y-%m-%d';
                break;
            case 'week':
                dateFormat = '%Y-%u';
                break;
            case 'month':
                dateFormat = '%Y-%m';
                break;
            default:
                dateFormat = '%Y-%m-%d';
        }

        let query = `
      SELECT 
        DATE_FORMAT(datetime, '${dateFormat}') as period,
        log_type,
        COUNT(*) as count
      FROM logscore_logs
      WHERE 1=1
    `;

        const params = [];

        if (serverIds.length > 0) {
            const placeholders = serverIds.map(() => '?').join(',');
            query += ` AND server_id IN (${placeholders})`;
            params.push(...serverIds);
        }

        if (logTypes.length > 0) {
            const placeholders = logTypes.map(() => '?').join(',');
            query += ` AND log_type IN (${placeholders})`;
            params.push(...logTypes);
        }

        if (dateFrom) {
            query += ' AND datetime >= ?';
            params.push(dateFrom);
        }

        if (dateTo) {
            query += ' AND datetime <= ?';
            params.push(dateTo);
        }

        query += ' GROUP BY period, log_type ORDER BY period ASC';

        const [results] = await pool.query(query, params);
        return results;
    }

    static async getDistributionByType(filters) {
        const pool = getPool();
        const {
            serverIds = [],
            logTypes = [],
            dateFrom,
            dateTo,
            limit = 10
        } = filters;

        let query = `
      SELECT 
        log_type,
        COUNT(*) as count
      FROM logscore_logs
      WHERE 1=1
    `;

        const params = [];

        if (serverIds.length > 0) {
            const placeholders = serverIds.map(() => '?').join(',');
            query += ` AND server_id IN (${placeholders})`;
            params.push(...serverIds);
        }

        if (logTypes.length > 0) {
            const placeholders = logTypes.map(() => '?').join(',');
            query += ` AND log_type IN (${placeholders})`;
            params.push(...logTypes);
        }

        if (dateFrom) {
            query += ' AND datetime >= ?';
            params.push(dateFrom);
        }

        if (dateTo) {
            query += ' AND datetime <= ?';
            params.push(dateTo);
        }

        query += ' GROUP BY log_type ORDER BY count DESC LIMIT ?';
        params.push(limit);

        const [results] = await pool.query(query, params);
        return results;
    }

    static async getDistributionByServer(filters) {
        const pool = getPool();
        const {
            serverIds = [],
            logTypes = [],
            dateFrom,
            dateTo
        } = filters;

        let query = `
      SELECT 
        s.server_id,
        s.server_name,
        COUNT(l.id) as count
      FROM logscore_servers s
      LEFT JOIN logscore_logs l ON s.server_id = l.server_id
    `;

        const whereConditions = [];
        const params = [];

        if (serverIds.length > 0) {
            const placeholders = serverIds.map(() => '?').join(',');
            whereConditions.push(`s.server_id IN (${placeholders})`);
            params.push(...serverIds);
        }

        if (logTypes.length > 0) {
            const placeholders = logTypes.map(() => '?').join(',');
            whereConditions.push(`l.log_type IN (${placeholders})`);
            params.push(...logTypes);
        }

        if (dateFrom) {
            whereConditions.push('l.datetime >= ?');
            params.push(dateFrom);
        }

        if (dateTo) {
            whereConditions.push('l.datetime <= ?');
            params.push(dateTo);
        }

        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        query += ' GROUP BY s.server_id, s.server_name ORDER BY count DESC';

        const [results] = await pool.query(query, params);
        return results;
    }
}
