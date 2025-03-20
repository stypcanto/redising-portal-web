const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken"); // 🔹 Agregado: Importar jsonwebtoken
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const pool = require("./config/db"); // Asegúrate de que la ruta es correcta

const app = express();
const port = process.env.PORT || 5001; // Permite usar variables de entorno

// 🛡️ Middleware
app.use(cors());
app.use(express.json());

// 📝 Logger para ver las peticiones en consola
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// 📌 Rutas
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// 🌍 Ruta de prueba
app.get("/", (req, res) => res.send("Servidor corriendo 🚀"));

// 🔹 Ruta para obtener datos del usuario desde el token
app.get("/portaladmin", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del header
    if (!token) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica el token
    } catch (error) {
      return res.status(403).json({ success: false, message: "Token inválido" });
    }

    const { dni } = decoded; // Extrae el DNI del usuario

    // Busca al usuario en la base de datos
    const result = await pool.query("SELECT * FROM personal_cenate WHERE dni = $1", [dni]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        nombres: user.nombres.trim(), // 🔹 Se usa trim() para evitar espacios extras
        apellido_paterno: user.apellido_paterno.trim(),
        apellido_materno: user.apellido_materno.trim(),
        correo: user.correo,
      }
    });
  } catch (error) {
    console.error("❌ Error en /portaladmin:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// 🔹 Ruta para obtener toda la data de personal
app.get("/personal", async (req, res) => {
  try {
    const personal = await pool.query("SELECT * FROM personal_cenate"); // Ajusta según tu base de datos
    res.json({ success: true, data: personal.rows });
  } catch (error) {
    console.error("❌ Error en /personal:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// ❌ Middleware para manejar rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada 🚫" });
});

// 🚀 Iniciar servidor
app.listen(port, () => console.log(`✅ Servidor en http://localhost:${port}`));
