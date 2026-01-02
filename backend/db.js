import sql from 'mssql'
import dotenv from 'dotenv';
dotenv.config(); //load env variables

const config = {
  server: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'personalapps',
  options: {
        encrypt: true,
        enableArithAbort: true
    },

}

// Create a connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to Azure SQL Database");
    return pool;
  })
  .catch(err => {
    console.error("❌ DB Connection Failed:", err);
    process.exit(1);
  });

  
export {poolPromise, sql} 


/* my sql logic 
import mysql from 'mysql2/promise'
import {Connector} from '@google-cloud/cloud-sql-connector';
import path from "path"
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';
dotenv.config(); //load env variables


const connection = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'personalapps',
  port: 3306,
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
*/