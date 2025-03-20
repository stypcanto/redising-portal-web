const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

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


// ❌ Middleware para manejar rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada 🚫" });
});

// 🚀 Iniciar servidor
app.listen(port, () => console.log(`✅ Servidor en http://localhost:${port}`));
