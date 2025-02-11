const { Client } = require('pg');
require('dotenv').config();

// Configuración de la base de datos usando las variables de entorno
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

client
  .connect()  // Conectar a la base de datos
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos', err.stack);
  })
  .finally(() => {
    client.end();  // Cerrar la conexión
  });