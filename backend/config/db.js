import mysql from 'mysql2/promise';
import env from './env.js';

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Immediately verify connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`Connected to MySQL database "${env.db.name}" successfully.`);
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
})();

export default pool;
