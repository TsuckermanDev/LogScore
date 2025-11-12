import { getPool } from '../config/database.js';

export class DatabaseModel {
    static async initializeTables() {
        const pool = getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Create logscore_servers table
            await connection.query(`
        CREATE TABLE IF NOT EXISTS logscore_servers (
          server_id VARCHAR(64) PRIMARY KEY,
          server_name VARCHAR(255) NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_server_name (server_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

            // 2. Create logscore_types table
            await connection.query(`
        CREATE TABLE IF NOT EXISTS logscore_types (
          log_type VARCHAR(128) NOT NULL,
          server_id VARCHAR(64) NOT NULL,
          format TEXT NOT NULL,
          expires INT NOT NULL DEFAULT 30,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (log_type, server_id),
          FOREIGN KEY (server_id) REFERENCES logscore_servers(server_id) ON DELETE CASCADE,
          INDEX idx_server_type (server_id, log_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

            // 3. Create logscore_types_data table
            await connection.query(`
        CREATE TABLE IF NOT EXISTS logscore_types_data (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          log_type VARCHAR(128) NOT NULL,
          server_id VARCHAR(64) NOT NULL,
          type_data VARCHAR(128) NOT NULL,
          data_type ENUM('string', 'number', 'boolean', 'datetime') NOT NULL DEFAULT 'string',
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_type_data (log_type, server_id, type_data),
          INDEX idx_type_server (log_type, server_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

            // Add foreign key for logscore_types_data after both tables exist
            await connection.query(`
        ALTER TABLE logscore_types_data
        ADD CONSTRAINT fk_types_data_types
        FOREIGN KEY (log_type, server_id)
        REFERENCES logscore_types(log_type, server_id)
        ON DELETE CASCADE
      `).catch(() => {
                // Constraint might already exist
            });

            // 4. Create logscore_logs table
            await connection.query(`
        CREATE TABLE IF NOT EXISTS logscore_logs (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          log_type VARCHAR(128) NOT NULL,
          server_id VARCHAR(64) NOT NULL,
          datetime DATETIME NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_server_type (server_id, log_type),
          INDEX idx_datetime (datetime),
          INDEX idx_expires (expires_at),
          INDEX idx_log_type (log_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

            // Add foreign key for logscore_logs
            await connection.query(`
        ALTER TABLE logscore_logs
        ADD CONSTRAINT fk_logs_types
        FOREIGN KEY (log_type, server_id)
        REFERENCES logscore_types(log_type, server_id)
        ON DELETE CASCADE
      `).catch(() => {
                // Constraint might already exist
            });

            // 5. Create logscore_data table
            await connection.query(`
        CREATE TABLE IF NOT EXISTS logscore_data (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          log_id BIGINT UNSIGNED NOT NULL,
          data_key VARCHAR(128) NOT NULL,
          data_value TEXT NOT NULL,
          FOREIGN KEY (log_id) REFERENCES logscore_logs(id) ON DELETE CASCADE,
          INDEX idx_log_key (log_id, data_key),
          INDEX idx_key_value (data_key, data_value(255))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

            // 6. Create logscore_api_keys table
            await connection.query(`
        CREATE TABLE IF NOT EXISTS logscore_api_keys (
          api_key VARCHAR(128) PRIMARY KEY,
          uses BIGINT UNSIGNED NOT NULL DEFAULT 0,
          last_use DATETIME NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME NULL,
          INDEX idx_expires (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

            // 7. Create logscore_admins table
            await connection.query(`
        CREATE TABLE IF NOT EXISTS logscore_admins (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          login VARCHAR(64) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME NULL,
          INDEX idx_login (login)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

            await connection.commit();
            console.log('✅ All database tables initialized successfully');
        } catch (error) {
            await connection.rollback();
            console.error('❌ Failed to initialize tables:', error.message);
            throw error;
        } finally {
            connection.release();
        }
    }
}
