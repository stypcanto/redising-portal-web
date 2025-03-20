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
const port = 5001;

// Configuración de CORS para permitir solicitudes desde distintos puertos
app.use(cors({
  origin: "http://10.0.88.241:5173",
  // origin: ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173', 'http://localhost:5176'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

// Middleware para parsear cuerpos de solicitudes en formato JSON
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Middleware para verificar el token JWT
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];  
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado, token requerido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Token no válido.' });
  }
}

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
  let userData = req.body;

  // Verificamos si los datos vienen anidados en "dni"
  if (userData.dni && typeof userData.dni === 'object') {
    userData = userData.dni;
  }

  const { dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, password } = userData;

  console.log('Datos recibidos para registro:', userData);

  if (!dni || !nombres || !apellido_paterno || !apellido_materno || !correo || !password) {
    return res.status(400).json({ message: 'Por favor ingresa los campos obligatorios.' });
  }

  try {
    // Comprobar si el usuario ya existe
    const result = await pool.query('SELECT * FROM Personal_CENATE WHERE dni = $1', [dni]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'El DNI ya está registrado.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario
    const insertQuery = `
      INSERT INTO Personal_CENATE (dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, password) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING dni, nombres, apellido_paterno, apellido_materno, correo, profesion`;
    
    const insertValues = [dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, hashedPassword];

    const newUser = await pool.query(insertQuery, insertValues);

    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente.', user: newUser.rows[0] });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ message: 'Hubo un error al registrar el usuario.' });
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  let loginData = req.body;

  // Verificamos si los datos vienen anidados en "dni"
  if (loginData.dni && typeof loginData.dni === 'object') {
    loginData = loginData.dni;
  }

  const { dni, password } = loginData;

  if (!dni || !password) {
    return res.status(400).json({ message: 'DNI y contraseña son requeridos.' });
  }

  try {
    // Buscar el usuario por DNI
    const query = 'SELECT dni, nombres, correo, password FROM Personal_CENATE WHERE dni = $1';
    const user = await pool.query(query, [dni]);

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
      { dni: user.rows[0].dni, nombres: user.rows[0].nombres, correo: user.rows[0].correo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { dni: user.rows[0].dni, nombres: user.rows[0].nombres, correo: user.rows[0].correo } });
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ message: 'Error en el servidor al procesar el login.' });
  }
});

// Ruta privada protegida por JWT
app.get('/portaladmin', verifyToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT dni, nombres, correo FROM Personal_CENATE WHERE dni = $1', [req.user.dni]);
    return res.json({ user: user.rows[0] });
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    return res.status(400).json({ message: 'Error al obtener el perfil.' });
  }
});

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Conexión a la base de datos y arranque del servidor
pool.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1);
  });
