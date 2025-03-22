//  Este middleware protege las rutas verificando que el usuario tenga un token JWT válido antes 
// de permitirle acceder a contenido restringido.

const jwt = require("jsonwebtoken");

// Middleware para verificar el token en las solicitudes protegidas
const verifyToken = (req, res, next) => {
    // Obtener el header de autorización (puede venir en mayúsculas o minúsculas según el cliente)
    const authHeader = req.headers["authorization"];
    console.log("🔍 Header recibido:", authHeader);

    // Verificar si el header de autorización existe y si empieza con "Bearer "
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        console.log("❌ No se recibió un token válido en el header.");
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado o malformado." });
    }

    // Extraer el token, eliminando la palabra "Bearer "
    const token = authHeader.split(" ")[1];
    console.log("📌 Token extraído:", token);

    // Si no se obtuvo un token después de "Bearer", devolver un error
    if (!token) {
        console.log("❌ No se recibió un token en el header.");
        return res.status(401).json({ message: "Formato de token inválido." });
    }

    try {
        // Verificar y decodificar el token usando la clave secreta almacenada en las variables de entorno
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token verificado:", verified);

        // Guardar los datos del usuario autenticado en `req.user` para su uso en rutas protegidas
        req.user = verified;
        next(); // Continuar con la siguiente función en la ruta
    } catch (err) {
        console.error("⚠️ Error al verificar token:", err.name, "-", err.message);
        
        // Manejo específico de errores relacionados con el token
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado. Inicia sesión nuevamente." });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Token inválido." });
        } else {
            return res.status(500).json({ message: "Error en la autenticación." });
        }
    }
};

module.exports = verifyToken; // Exportar el middleware para su uso en las rutas protegidas
