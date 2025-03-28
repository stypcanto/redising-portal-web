const express = require("express");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware para verificar Superadmin
const verifySuperadmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No autorizado: Falta el token",
        shouldRefresh: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.rol !== "Superadmin") {
      return res.status(403).json({ 
        success: false, 
        message: "Acceso denegado: No eres Superadmin",
        shouldRefresh: false
      });
    }

    // Verificar si el usuario aún existe en la base de datos
    const userExists = await pool.query(
      "SELECT id FROM personal_cenate WHERE id = $1 AND dni = $2",
      [decoded.id, decoded.dni]
    );

    if (userExists.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: "Usuario no encontrado",
        shouldLogout: true
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Error en autenticación:", error);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expirado",
        shouldRefresh: true,
        expiredAt: error.expiredAt
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: "Token inválido",
      shouldLogout: true
    });
  }
};

// Ruta para obtener todos los usuarios (completa)
router.get("/users", verifySuperadmin, async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT 
        id, dni, nombres, apellido_paterno, apellido_materno,
        fecha_nacimiento, sexo, correo, telefono, domicilio,
        profesion, especialidad, colegiatura, tipo_contrato,
        rol, fecha_registro, estado
      FROM personal_cenate
    `);

    res.json({ 
      success: true, 
      data: users.rows.map(user => {
        const userData = { ...user };
        delete userData.password;
        return userData;
      }),
      total: users.rows.length
    });
  } catch (error) {
    console.error("❌ Error en /admin/users:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Ruta para obtener un usuario específico
router.get("/user/:id", verifySuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        id, dni, nombres, apellido_paterno, apellido_materno,
        fecha_nacimiento, sexo, correo, telefono, domicilio,
        profesion, especialidad, colegiatura, tipo_contrato,
        rol, fecha_registro, estado
      FROM personal_cenate 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    delete user.password;

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Ruta para eliminar usuario
router.delete("/delete-user/:id", verifySuperadmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query("DELETE FROM personal_cenate WHERE id = $1 RETURNING *", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({
      success: true,
      message: "Usuario eliminado correctamente",
      deletedUser: result.rows[0]
    });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ success: false, message: "Error al eliminar usuario" });
  }
});

// Ruta para actualizar rol
router.put("/update-role", verifySuperadmin, async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ success: false, message: "Faltan datos en la solicitud" });
    }

    const rolesPermitidos = ["Usuario", "Administrador", "Superadmin"];
    if (!rolesPermitidos.includes(newRole)) {
      return res.status(400).json({ success: false, message: "Rol no válido" });
    }

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

module.exports = router;