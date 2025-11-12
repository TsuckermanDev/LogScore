import { getPool } from '../config/database.js';
import bcrypt from 'bcrypt';

export class AdminModel {
    static async create(login, password) {
        const pool = getPool();
        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await pool.query(
            'INSERT INTO logscore_admins (login, password) VALUES (?, ?)',
            [login, hashedPassword]
        );

        return result.insertId;
    }

    static async findByLogin(login) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM logscore_admins WHERE login = ?',
            [login]
        );
        return rows[0] || null;
    }

    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    static async updateLastLogin(login) {
        const pool = getPool();
        await pool.query(
            'UPDATE logscore_admins SET last_login = NOW() WHERE login = ?',
            [login]
        );
    }

    static async createDefaultAdmin(login, password) {
        try {
            const existing = await this.findByLogin(login);
            if (!existing) {
                await this.create(login, password);
                console.log(`✅ Default admin created: ${login}`);
            }
        } catch (error) {
            console.error('❌ Failed to create default admin:', error.message);
        }
    }
}
