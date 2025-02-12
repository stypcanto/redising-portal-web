// Importamos las dependencias necesarias
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

// Verifica que JWT_SECRET esté correctamente cargada
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Inicializamos el servidor de Express y definimos el puerto
const app = express();
const port = 5001;  // Puerto en el que se ejecutará el servidor

// Configuración de CORS para permitir solicitudes desde localhost:5175 y localhost:5173
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173'], // Permitir ambos puertos en caso de que el frontend use otro
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

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log(req.body); // Agregar para depurar el contenido de la solicitud

  // Validar si los datos están presentes
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Por favor ingresa todos los campos.' });
  }

  try {
    // Comprobar si el usuario ya existe
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const insertResult = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const newUser = insertResult.rows[0];

    // Responder con los datos del usuario registrado
    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente.', user: newUser });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ message: 'Hubo un error al registrar el usuario.' });
  }
});



// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verificar si los campos email y password están presentes
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    // Buscar el usuario por email
    const query = 'SELECT * FROM users WHERE email = $1';
    const params = [email];
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
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar el token
    return res.json({ token, user: { email: user.rows[0].email } });
  } catch (err) {
    console.error('Error en el login:', err);
    return res.status(500).json({ message: 'Error en el servidor al procesar el login.', error: err.message });
  }
});

// Ruta privada que requiere autenticación mediante JWT
app.get('/portaladmin', verifyToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
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
