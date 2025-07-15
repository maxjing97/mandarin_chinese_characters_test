const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });



const connection = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'mandarin_app',
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
  connectTimeout: 30000,
});

async function testPoolConnection() {
  try {
    const [rows] = await connection.query('SELECT 1');
    console.log('✅ Database pool is connected.');
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err.message);
  }
}
testPoolConnection()

module.exports = connection;