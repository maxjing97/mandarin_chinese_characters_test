import mysql from 'mysql2/promise'
import {Connector} from '@google-cloud/cloud-sql-connector';
import path from "path"
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';
dotenv.config(); //load env variables
const googlekey = process.env.GOOGLE_IAM
//process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, './service_key.json');
// Write the JSON key to a temporary file
const tmpFilePath = path.join(os.tmpdir(), 'temp_key.json'); //get a temporary path
fs.writeFileSync(tmpFilePath, googlekey);
process.env.GOOGLE_APPLICATION_CREDENTIALS  = tmpFilePath


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