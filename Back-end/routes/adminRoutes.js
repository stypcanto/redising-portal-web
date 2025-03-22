const express = require("express");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔹 Middleware para verificar si el usuario es Superadmin
const verifySuperadmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No autorizado: Falta el token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "Superadmin") {
      return res.status(403).json({ success: false, message: "Acceso denegado: No eres Superadmin" });
    }

    req.user = decoded; // Guardamos los datos del usuario en la request
    next();
  } catch (error) {
    console.error("❌ Error en autenticación:", error);
    res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};

// 🔹 Ruta para actualizar el rol de un usuario
router.put("/update-role", verifySuperadmin, async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    // Validar entrada
    if (!userId || !newRole) {
      return res.status(400).json({ success: false, message: "Faltan datos en la solicitud" });
    }

    // Validar roles permitidos
    const rolesPermitidos = ["Usuario", "Administrador", "Superadmin"];
    if (!rolesPermitidos.includes(newRole)) {
      return res.status(400).json({ success: false, message: "Rol no válido" });
    }

    // Actualizar en la BD
    const result = await pool.query(
      "UPDATE personal_cenate SET rol = $1 WHERE id = $2 RETURNING id, dni, nombres, rol",
      [newRole, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({
      success: true,
      message: "Rol actualizado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error en /update-role:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// 🔹 Ruta para obtener todos los usuarios
router.get("/users", verifySuperadmin, async (req, res) => {
  try {
    
    // esto es Impotnte para capturar la informacion de tabla
    const users = await pool.query("SELECT id, dni, nombres, apellido_paterno, apellido_materno, rol FROM personal_cenate");

    
    if (users.rowCount === 0) {
      return res.status(404).json({ success: false, message: "No hay usuarios registrados" });
    }

    res.json({ success: true, data: users.rows });
  } catch (error) {
    console.error("❌ Error en /admin/users:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

module.exports = router;