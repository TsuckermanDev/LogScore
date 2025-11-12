import 'dotenv/config';

export const config = {
    env: process.env.NODE_ENV || 'development',
api: {
  port: parseInt(process.env.API_PORT) || 3001,
  host: process.env.API_HOST || '0.0.0.0'
},
web: {
  port: parseInt(process.env.WEB_PORT) || 3000,
  host: process.env.WEB_HOST || '0.0.0.0'
},
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'logscore',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
        waitForConnections: true,
        queueLimit: 0
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'change_this_secret_key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true
    },
    cleanup: {
        cron: process.env.CLEANUP_CRON || '0 * * * *'
    },
    defaultAdmin: {
        login: process.env.DEFAULT_ADMIN_LOGIN || 'admin',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
    }
};
