const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });


const dbPassword = process.env.DB_PASSWORD;
const hostname = process.env.DB_HOSTNAME;
//store the connection 
const connection = mysql.createConnection({
    host: `${hostname}`, // Your MySQL host (default is localhost)
    user: 'admin',      // Your MySQL username
    password: `${dbPassword}`,  // Your MySQL password
    database: 'mandarin_app',    // Your database name
});

connection.connect(err => {
if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
}
console.log('Connected to the database!');
}); 

module.exports = connection;