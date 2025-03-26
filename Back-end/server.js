const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pool = require("./config/db");
const { hashPassword } = require('./utils/authHelpers');
const app = express();
const port = process.env.PORT || 5001;



// Middleware
app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// Ruta de prueba
app.get("/", (req, res) => res.send("Servidor corriendo 🚀"));

// Ruta para datos del usuario desde token
app.get("/portaladmin", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(403).json({ success: false, message: "Token inválido" });
    }

    const { dni } = decoded;
    const result = await pool.query("SELECT * FROM personal_cenate WHERE dni = $1", [dni]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const userData = { ...user };
    delete userData.password;

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error("❌ Error en /portaladmin:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Ruta para obtener toda la data de personal
app.get("/personal", async (req, res) => {
  try {
    const personal = await pool.query(`
      SELECT 
        id, dni, nombres, apellido_paterno, apellido_materno,
        fecha_nacimiento, sexo, correo, telefono, domicilio,
        profesion, especialidad, colegiatura, tipo_contrato,
        rol, fecha_registro, estado
      FROM personal_cenate
    `);
    
    res.json({ 
      success: true, 
      data: personal.rows.map(user => {
        const userData = { ...user };
        delete userData.password;
        return userData;
      })
    });
  } catch (error) {
    console.error("❌ Error en /personal:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Ruta para modificar data del personal

app.put("/personal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dni,
      nombres,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      correo,
      telefono,
      domicilio,
      profesion,
      especialidad,
      colegiatura,
      tipo_contrato,
      rol
    } = req.body;

    // Validación básica
    if (!dni || !nombres || !rol) {
      return res.status(400).json({ 
        success: false, 
        message: "DNI, nombres y rol son campos requeridos" 
      });
    }

    const result = await pool.query(
      `UPDATE personal_cenate SET
        dni = $1,
        nombres = $2,
        apellido_paterno = $3,
        apellido_materno = $4,
        fecha_nacimiento = $5,
        sexo = $6,
        correo = $7,
        telefono = $8,
        domicilio = $9,
        profesion = $10,
        especialidad = $11,
        colegiatura = $12,
        tipo_contrato = $13,
        rol = $14
      WHERE id = $15
      RETURNING *`,
      [
        dni,
        nombres,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        sexo,
        correo,
        telefono,
        domicilio,
        profesion,
        especialidad,
        colegiatura,
        tipo_contrato,
        rol,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuario no encontrado" 
      });
    }

    const updatedUser = result.rows[0];
    delete updatedUser.password;

    res.json({ 
      success: true, 
      message: "Usuario actualizado correctamente",
      user: updatedUser
    });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    
    if (error.code === '23505' && error.constraint === 'personal_cenate_dni_key') {
      return res.status(400).json({ 
        success: false, 
        message: "El DNI ya está registrado" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar usuario" 
    });
  }
});



// Ruta POST para crear usuarios - Versión corregida
app.post("/personal", async (req, res) => {
  const client = await pool.connect(); // Usamos un cliente para la transacción
  
  try {
    await client.query('BEGIN'); // Iniciamos transacción

    const {
      dni,
      nombres,
      apellido_paterno,
      apellido_materno,
      correo,
      telefono,
      fecha_nacimiento,
      sexo,
      domicilio,
      profesion,
      especialidad,
      tipo_contrato,
      rol = 'Usuario'
    } = req.body;

    // Validación mejorada
    const requiredFields = ['dni', 'nombres', 'apellido_paterno', 'correo'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan campos requeridos: ${missingFields.join(', ')}`
      });
    }

    if (!/^\d{8}$/.test(dni)) {
      return res.status(400).json({
        success: false,
        message: "El DNI debe tener 8 dígitos numéricos"
      });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword("12345678");

    // Verificar si usuario ya existe
    const userExists = await client.query(
      'SELECT id FROM personal_cenate WHERE dni = $1 OR correo = $2', 
      [dni, correo]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El DNI o correo ya están registrados"
      });
    }

    // Insertar nuevo usuario
    const result = await client.query(
      `INSERT INTO personal_cenate (
        dni, nombres, apellido_paterno, apellido_materno, correo, telefono,
        fecha_nacimiento, sexo, domicilio, profesion, especialidad,
        tipo_contrato, rol, password, debe_cambiar_password, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, dni, nombres, correo, rol`,
      [
        dni,
        nombres,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono || null,
        fecha_nacimiento || null,
        sexo || null,
        domicilio || null,
        profesion || null,
        especialidad || null,
        tipo_contrato || null,
        rol,
        hashedPassword, // Usamos el hash
        true,
        true
      ]
    );

    await client.query('COMMIT'); // Confirmamos la transacción

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      user: result.rows[0],
      temp_password: "12345678"
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Revertimos en caso de error
    console.error("Error al crear usuario:", error);

    // Manejo específico de errores de PostgreSQL
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: "El DNI o correo electrónico ya están registrados"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release(); // Liberamos el cliente
  }
});


// Ruta para eliminar personal
app.delete("/personal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe
    const user = await pool.query("SELECT id FROM personal_cenate WHERE id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuario no encontrado" 
      });
    }

    // Eliminar el usuario
    await pool.query("DELETE FROM personal_cenate WHERE id = $1", [id]);
    
    res.json({ 
      success: true, 
      message: "Usuario eliminado correctamente" 
    });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al eliminar usuario" 
    });
  }
});

// Middleware para rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada 🚫" });
});

// Iniciar servidor
app.listen(port, () => console.log(`✅ Servidor en http://localhost:${port}`));