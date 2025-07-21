import mysql from 'mysql2/promise'
import {Connector} from '@google-cloud/cloud-sql-connector';
import path from "path"
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config(); //load env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, './service_key.json');


const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: 'potent-plasma-466606-d0:us-central1:mainmysql',
  ipType: 'PUBLIC',
});


const connection = mysql.createPool({
  ...clientOpts,
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

export default connection;