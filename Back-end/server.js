const express = require("express");
const cors = require("cors");
require("dotenv").config();
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
app.get("/portaladmin", (req, res) => {
  res.json({ success: true, message: "PortalAdmin data cargada correctamente" });
});

app.get("/personal", async (req, res) => {
  try {
    const personal = await pool.query("SELECT * FROM personal_cenate"); // Ajusta según tu base de datos
    res.json({ success: true, data: personal.rows });
  } catch (error) {
    console.error("Error al obtener personal:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});


// ❌ Middleware para manejar rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada 🚫" });
});

// 🚀 Iniciar servidor
app.listen(port, () => console.log(`✅ Servidor en http://localhost:${port}`));


