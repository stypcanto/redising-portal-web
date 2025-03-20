const { Pool } = require('pg');  // Usamos Pool en lugar de Client
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


// Función para probar la conexión
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a la base de datos');
    client.release(); // Liberamos la conexión
  } catch (err) {
    console.error('❌ Error de conexión a la base de datos:', err.message);
  }
};

// Exportamos la instancia del Pool para usar en otros archivos
module.exports = { pool, connectDB };

// 📌 ¿Por qué es mejor Pool en lugar de Client?
// - Client abre una nueva conexión por cada solicitud, lo que no es eficiente en producción.
// - Pool reutiliza conexiones y maneja concurrencia de manera eficiente.