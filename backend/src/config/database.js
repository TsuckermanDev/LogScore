import mysql from 'mysql2/promise';
import { config } from './config.js';

let pool = null;

export const createPool = () => {
    if (!pool) {
        // ИСПРАВЬ ТУТ - Добавь timezone к config.database
        pool = mysql.createPool({
            ...config.database,
            timezone: '+03:00'  // ← ДОБАВЬ ЭТУ СТРОКУ
        });
        console.log('✅ Database pool created');
    }
    return pool;
};

export const getPool = () => {
    if (!pool) {
        throw new Error('Database pool not initialized. Call createPool() first.');
    }
    return pool;
};

export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connection successful');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
};
