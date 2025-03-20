const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("🔍 Header recibido:", authHeader); // Verifica si llega el token
  
    if (!authHeader) {
        console.log("❌ No se recibió el header de autorización.");
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }
  
    const token = authHeader.split(" ")[1]; // Extrae el token después de "Bearer"
    console.log("🔍 Token extraído:", token); // Verifica que el token extraído no sea `undefined`
  
    if (!token) {
        console.log("❌ No se recibió el token en el header.");
        return res.status(401).json({ message: "Formato de token inválido." });
    }
  
    console.log("📌 Token recibido:", token);

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verificado:", verified); // Si llega aquí, el token es válido
      req.user = verified;
      next();
    } catch (err) {
      console.error("⚠️ Token inválido o expirado:", err.message);
      res.status(401).json({ message: "Token inválido o expirado. Inicia sesión nuevamente." });
    }
};

module.exports = verifyToken;
