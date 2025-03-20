const express = require("express");
const pool = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/portaladmin", verifyToken, async (req, res) => {
  try {
    const user = await pool.query("SELECT dni, nombres, apellido_paterno, apellido_materno, correo FROM Personal_CENATE WHERE dni = $1", [req.user.dni]);

    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    return res.json({ success: true, user: user.rows[0] });
  } catch (err) {
    console.error("Error al obtener el usuario:", err);
    return res.status(500).json({ success: false, message: "Error al obtener el usuario" });
  }
});

module.exports = router;
