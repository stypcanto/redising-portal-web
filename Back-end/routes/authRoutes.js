const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { check, validationResult } = require("express-validator");
const { updateRoleController } = require('../controllers/authController');

const router = express.Router();

// ✅ Registrar usuario
router.post(
  "/register",
  [
    check("dni").notEmpty().withMessage("El DNI es obligatorio"),
    check("correo").isEmail().withMessage("Correo inválido"),
    check("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    check("rol").isIn(['Admin', 'User', 'Superadmin']).withMessage("Rol no válido"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let {
      dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo,
      telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, 
      tipo_contrato, password, rol
    } = req.body;

    // 🔹 Limpieza de datos
    dni = dni.trim();
    correo = correo.trim().toLowerCase();
    nombres = nombres.trim();
    apellido_paterno = apellido_paterno.trim();
    apellido_materno = apellido_materno.trim();

    try {
      const userExists = await pool.query("SELECT dni FROM Personal_CENATE WHERE dni = $1", [dni]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ success: false, message: "El DNI ya está registrado." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        `INSERT INTO Personal_CENATE (dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, password, rol) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING dni, nombres, apellido_paterno, apellido_materno, correo, profesion, rol`,
        [dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, hashedPassword, rol]
      );

      res.status(201).json({ success: true, message: "Usuario registrado exitosamente.", user: newUser.rows[0] });
    } catch (err) {
      console.error("❌ Error al registrar el usuario:", err);
      res.status(500).json({ success: false, message: "Error al registrar el usuario." });
    }
  }
);

// ✅ Iniciar sesión
router.post("/login", async (req, res) => {
  console.log("Inicio de solicitud de login - DNI:", req.body.dni);
  
  try {
    const { dni, password } = req.body;

    // Validación básica
    if (!dni || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "DNI y contraseña son requeridos" 
      });
    }

    // Buscar usuario
    console.log("Buscando usuario en BD...");
    const result = await pool.query(
      "SELECT dni, nombres, password, rol FROM personal_cenate WHERE dni = $1", 
      [dni.trim()]
    );

    if (result.rows.length === 0) {
      console.log("Usuario no encontrado");
      return res.status(401).json({ 
        success: false, 
        message: "Credenciales incorrectas" 
      });
    }

    const user = result.rows[0];
    console.log("Usuario encontrado:", user.dni);

    // Comparar contraseñas - solución mejorada
    console.log("Comparando contraseñas...");
    let isMatch;
    try {
      // Elimina espacios en blanco alrededor de la contraseña
      const cleanPassword = password.trim();
      isMatch = await bcrypt.compare(cleanPassword, user.password);
    } catch (bcryptError) {
      console.error("Error en bcrypt.compare:", bcryptError);
      return res.status(500).json({
        success: false,
        message: "Error al verificar credenciales",
        error: bcryptError.message
      });
    }

    if (!isMatch) {
      console.log("Contraseña no coincide");
      return res.status(401).json({ 
        success: false, 
        message: "Credenciales incorrectas" 
      });
    }

    // Generar token
    console.log("Generando token JWT...");
    const token = jwt.sign(
      {
        dni: user.dni,
        nombres: user.nombres,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );


    // Respuesta debe incluir el token explícitamente
    console.log("Login exitoso para:", user.dni);
    res.json({
      success: true,
      token: token, // Asegúrate que esta propiedad se llama "token"
      user: {
        dni: user.dni,
        nombres: user.nombres,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error("Error completo en endpoint /login:", {
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: "Error en el servidor al procesar el login",
      error: error.message
    });
  }
});


// ✅ Refrescar token
// Ruta para refrescar token - Versión mejorada
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      success: false, 
      message: "No se proporcionó refresh token",
      shouldLogout: true
    });
  }

  try {
    // Verificar el refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH || process.env.JWT_SECRET);
    
    // Verificar si el usuario aún existe
    const user = await pool.query(
      "SELECT id, dni, nombres, rol FROM personal_cenate WHERE dni = $1", 
      [decoded.dni]
    );

    if (user.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: "Usuario no encontrado",
        shouldLogout: true
      });
    }

    // Generar nuevos tokens
    const newAccessToken = jwt.sign(
      {
        dni: user.rows[0].dni,
        nombres: user.rows[0].nombres,
        rol: user.rows[0].rol,
        id: user.rows[0].id
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m", algorithm: "HS512" }
    );

    const newRefreshToken = jwt.sign(
      { 
        dni: user.rows[0].dni,
        id: user.rows[0].id  // Añade esto para consistencia
      },
      process.env.JWT_SECRET_REFRESH || process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 15 * 60 * 1000 // 15 minutos en ms
    });

  } catch (err) {
    console.error("❌ Error al refrescar token:", err);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Sesión expirada. Por favor inicie sesión nuevamente.",
        shouldLogout: true
      });
    }
    
    return res.status(403).json({ 
      success: false, 
      message: "Token inválido",
      shouldLogout: true
    });
  }
});

// Añade esto en authRoutes.js o donde manejes middlewares
const checkRole = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== requiredRole) {
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }
    req.user = decoded; // Añade los datos del usuario al request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }
};





// Luego úsalo en tus rutas admin:
router.put('/update-role', checkRole('Superadmin'), updateRoleController);


module.exports = router;
