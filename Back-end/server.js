// Importamos las dependencias necesarias
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

// Inicializamos el servidor de Express y definimos el puerto
const app = express();
const port = 5001;  // Puerto en el que se ejecutará el servidor

// Configuración de CORS para permitir solicitudes desde localhost:5175 y localhost:5173
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:5173'], // Permitir ambos puertos en caso de que el frontend use otro
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

// Responde a las solicitudes OPTIONS (preflight)
app.options('*', cors());  // Responde a las solicitudes OPTIONS

// Middleware para parsear cuerpos de solicitudes en formato JSON
app.use(express.json());

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Función middleware para verificar si el token JWT es válido
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];  // 'Bearer token'
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado, token requerido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Agregar los datos del usuario al request
    next();  // Continuar con la solicitud
  } catch (err) {
    return res.status(400).json({ message: 'Token no válido.' });
  }
}

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Verificar si el usuario o el email ya existen en la base de datos
  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario o el email ya existen.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar en la base de datos
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
    return res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    return res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario por nombre de usuario o correo electrónico
    const query = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    const params = [username, username];  // 'username' puede ser nombre o correo electrónico
    const user = await pool.query(query, params);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar el token
    return res.json({ token });
  } catch (err) {
    console.error('Error en el login:', err);
    return res.status(500).json({ message: 'Error en el servidor al procesar el login.' });
  }
});

// Ruta privada que requiere autenticación mediante JWT
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.id]);
    return res.json({ user: user.rows[0] });
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    return res.status(400).json({ message: 'Error al obtener el perfil.' });
  }
});

// Ruta básica para comprobar que el servidor está funcionando correctamente
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Conectamos a la base de datos y, si la conexión es exitosa, iniciamos el servidor
pool.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1);  // Detener el servidor si no se puede conectar a la base de datos
  });