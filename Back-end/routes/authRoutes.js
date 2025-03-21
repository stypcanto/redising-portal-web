const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Registrar usuario
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

    const { dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, password } = req.body;

    try {
      const userExists = await pool.query("SELECT * FROM Personal_CENATE WHERE dni = $1", [dni]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ success: false, message: "El DNI ya está registrado." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        `INSERT INTO Personal_CENATE (dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, password) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING dni, nombres, apellido_paterno, apellido_materno, correo, profesion`,
        [dni, nombres, apellido_paterno, apellido_materno, colegiatura, correo, telefono, fecha_nacimiento, sexo, domicilio, especialidad, profesion, tipo_contrato, hashedPassword]
      );

      res.status(201).json({ success: true, message: "Usuario registrado exitosamente.", user: newUser.rows[0] });
    } catch (err) {
      console.error("Error al registrar el usuario:", err);
      res.status(500).json({ success: false, message: "Hubo un error al registrar el usuario." });
    }
  }
);

// Iniciar sesión
router.post("/login", async (req, res) => {
  const { dni, password } = req.body;

  if (!dni || !password) {
    return res.status(400).json({ success: false, message: "DNI y contraseña son requeridos." });
  }

  try {
    const user = await pool.query("SELECT dni, nombres, apellido_paterno, apellido_materno, correo, password FROM Personal_CENATE WHERE dni = $1", [dni]);

    console.log("🔹 Usuario encontrado:", user.rows[0]);  
    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Credenciales incorrectas." });
    }

    console.log("📌 Contraseña ingresada:", password);
    console.log("🔐 Hash almacenado en BD:", user.rows[0].password);

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    console.log("🔍 Comparación de contraseña:", isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Credenciales incorrectas." });
    }

    const token = jwt.sign(
      {
        dni: user.rows[0].dni,
        nombres: user.rows[0].nombres,
        apellido_paterno: user.rows[0].apellido_paterno,
        apellido_materno: user.rows[0].apellido_materno,
        correo: user.rows[0].correo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("🔹 Token generado:", token);

    res.json({ success: true, token, user: user.rows[0] });
  } catch (err) {
    console.error("Error en el login:", err);
    res.status(500).json({ success: false, message: "Error en el servidor al procesar el login." });
  }
});

module.exports = router;
