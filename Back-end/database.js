const { Client } = require('pg');  // Importamos el cliente de PostgreSQL
require('dotenv').config();  // Cargamos las variables de entorno

console.log('DB_PASS:', process.env.DB_PASS); 
// Configuración de la conexión a la base de datos
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});


// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await client.connect();
    console.log('Conexión exitosa a la base de datos');
  } catch (err) {
    console.error('Error de conexión a la base de datos', err.stack);
  }
};

// Exportamos la conexión y el cliente
module.exports = { client, connectDB };