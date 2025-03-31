// controllers/authController.js
exports.updateRoleController = async (req, res) => {
    try {
      const { dni, newRole } = req.body;
  
      // Validar que el rol sea válido (ejemplo: 'Admin', 'User', 'Superadmin')
      const validRoles = ['Admin', 'User', 'Superadmin'];
      if (!validRoles.includes(newRole)) {
        return res.status(400).json({ 
          success: false, 
          message: "Rol no válido" 
        });
      }
  
      // Actualizar en la base de datos
      const result = await pool.query(
        "UPDATE personal_cenate SET rol = $1 WHERE dni = $2 RETURNING dni, nombres, rol",
        [newRole, dni]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuario no encontrado" 
        });
      }
  
      res.status(200).json({ 
        success: true, 
        message: "Rol actualizado correctamente",
        user: result.rows[0] 
      });
  
    } catch (err) {
      console.error("❌ Error al actualizar el rol:", err);
      res.status(500).json({ 
        success: false, 
        message: "Error al actualizar el rol" 
      });
    }
  };