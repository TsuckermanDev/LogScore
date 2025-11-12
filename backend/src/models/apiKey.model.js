import { getPool } from '../config/database.js';
import { nanoid } from 'nanoid';

export class ApiKeyModel {
    static async create(expiresAt = null) {
        const pool = getPool();
        const apiKey = `lgs_${nanoid(48)}`; // lgs = logscore

        const [result] = await pool.query(
            'INSERT INTO logscore_api_keys (api_key, expires_at) VALUES (?, ?)',
            [apiKey, expiresAt]
        );

        return apiKey;
    }

    static async findByKey(apiKey) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_api_keys WHERE api_key = ?',
            [apiKey]
        );
        return rows[0] || null;
    }

    static async findAll() {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_api_keys ORDER BY created_at DESC'
        );
        return rows;
    }

    static async updateUsage(apiKey) {
        const pool = getPool();
        await pool.query(
            'UPDATE logscore_api_keys SET uses = uses + 1, last_use = NOW() WHERE api_key = ?',
            [apiKey]
        );
    }

    static async isValid(apiKey) {
        const key = await this.findByKey(apiKey);
        if (!key) return false;
        if (key.expires_at && new Date(key.expires_at) < new Date()) return false;
        return true;
    }

    static async delete(apiKey) {
        const pool = getPool();
        const [result] = await pool.query(
            'DELETE FROM logscore_api_keys WHERE api_key = ?',
            [apiKey]
        );
        return result.affectedRows > 0;
    }

    static async updateExpiration(apiKey, expiresAt) {
        const pool = getPool();
        const [result] = await pool.query(
            'UPDATE logscore_api_keys SET expires_at = ? WHERE api_key = ?',
            [expiresAt, apiKey]
        );
        return result.affectedRows > 0;
    }
}
