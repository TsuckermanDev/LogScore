import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

async function createAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'MpjIgfxxc5LYCbMIEX0l',
      database: 'logscore'
    });

    console.log('🔗 Connected to database');

    // Удаляем старого админа
    await connection.query('DELETE FROM logscore_admins WHERE login = ?', ['admin']);
    console.log('🗑️  Old admin deleted');

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('🔐 Password hashed:', hashedPassword);

    // Создаем нового админа
    await connection.query(
      'INSERT INTO logscore_admins (login, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );
    console.log('✅ Admin created: admin / admin123');

    // Проверяем
    const [rows] = await connection.query('SELECT login FROM logscore_admins WHERE login = ?', ['admin']);
    console.log('📋 Admins in DB:', rows);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdmin();
