// db.js
import mysql from 'mysql2/promise';

// Configura tu conexión a la base de datos aquí
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test_db'
});

export default connection;
