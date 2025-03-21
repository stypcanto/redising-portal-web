const express = require("express");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware para verificar si el usuario es Superadmin
const verifySuperadmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No autorizado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "Superadmin") {
      return res.status(403).json({ success: false, message: "Acceso denegado" });
    }

    next();
  } catch (error) {
    console.error("❌ Error en autenticación:", error);
    res.status(500).json({ success: false, message: "Error en autenticación" });
  }
};

// 🔹 Ruta para actualizar el rol de un usuario
router.put("/update-role", verifySuperadmin, async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    if (!userId || !newRole) {
      return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    const result = await pool.query(
      "UPDATE personal_cenate SET rol = $1 WHERE id = $2 RETURNING *",
      [newRole, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, message: "Rol actualizado correctamente", user: result.rows[0] });
  } catch (error) {
    console.error("❌ Error en /update-role:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// 🔹 Ruta para obtener todos los usuarios
router.get("/users", verifySuperadmin, async (req, res) => {
  try {
    const users = await pool.query("SELECT id, dni, nombres, rol FROM personal_cenate");
    res.json({ success: true, data: users.rows });
  } catch (error) {
    console.error("❌ Error en /admin/users:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

module.exports = router;
