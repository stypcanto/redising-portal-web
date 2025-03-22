const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// ✅ Registrar usuario
router.post(
  "/register",
  [
    check("dni").notEmpty().withMessage("El DNI es obligatorio"),
    check("correo").isEmail().withMessage("Correo inválido"),
    check("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, password, rol } = req.body;

    try {
      const userExists = await pool.query("SELECT * FROM Personal_CENATE WHERE dni = $1", [dni]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ success: false, message: "El DNI ya está registrado." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        `INSERT INTO Personal_CENATE (dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, password, rol) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING dni, nombres, apellido_paterno, apellido_materno, correo, profesion, rol`,
        [dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, hashedPassword, rol]
      );

      res.status(201).json({ success: true, message: "Usuario registrado exitosamente.", user: newUser.rows[0] });
    } catch (err) {
      console.error("Error al registrar el usuario:", err);
      res.status(500).json({ success: false, message: "Hubo un error al registrar el usuario." });
    }
  }
);

// ✅ Iniciar sesión
router.post("/login", async (req, res) => {
  const { dni, password } = req.body;

  if (!dni || !password) {
    return res.status(400).json({ success: false, message: "DNI y contraseña son requeridos." });
  }

  try {
    const result = await pool.query(
      // El problema de Login que tenia es porque no estaba considerando el rol durante el Login
      "SELECT dni, nombres, apellido_paterno, apellido_materno, correo, password, rol FROM Personal_CENATE WHERE dni = $1", 
      [dni]
    );

    console.log("🔹 Usuario encontrado:", result.rows);  

    if (result.rows.length === 0) {
      console.log("❌ Usuario no encontrado.");
      return res.status(400).json({ success: false, message: "Credenciales incorrectas." });
    }

    const user = result.rows[0];
    console.log("🔐 Hash almacenado en BD:", user.password);
    console.log("📌 Contraseña ingresada:", password);

    if (!user.password) {
      console.log("⚠️ No se encontró una contraseña en la BD.");
      return res.status(400).json({ success: false, message: "Error en la contraseña almacenada." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Comparación de contraseña:", isMatch);

    if (!isMatch) {
      console.log("❌ Contraseña incorrecta.");
      return res.status(400).json({ success: false, message: "Credenciales incorrectas." });
    }

    // ✅ Incluir el rol en el token
    const token = jwt.sign(
      {
        dni: user.dni,
        nombres: user.nombres.trim(),
        apellido_paterno: user.apellido_paterno.trim(),
        apellido_materno: user.apellido_materno.trim(),
        correo: user.correo,
        rol: user.rol, // ✅ Agregado
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Token generado:", token);

    // ✅ Enviar el rol en la respuesta
    res.json({
      success: true,
      token,
      user: {
        dni: user.dni,
        nombres: user.nombres.trim(),
        apellido_paterno: user.apellido_paterno.trim(),
        apellido_materno: user.apellido_materno.trim(),
        correo: user.correo,
        rol: user.rol, // ✅ Ahora el frontend puede leerlo correctamente
      },
    });
  } catch (err) {
    console.error("🚨 Error en el login:", err);
    res.status(500).json({ success: false, message: "Error en el servidor al procesar el login." });
  }
});

module.exports = router;
