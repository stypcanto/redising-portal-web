//  Este middleware protege las rutas verificando que el usuario tenga un token JWT válido antes 
// de permitirle acceder a contenido restringido.

const jwt = require("jsonwebtoken");

// Middleware para verificar el token en las solicitudes protegidas
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("🔍 Header recibido:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No se recibió un token válido en el header.");
        return res.status(401).json({ success: false, message: "Acceso denegado. Token no proporcionado o malformado." });
    }

    const token = authHeader.split(" ")[1]?.trim();

    if (!token || token.length === 0) {
        console.log("❌ Token vacío.");
        return res.status(401).json({ success: false, message: "Formato de token inválido." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token verificado para el usuario:", verified.dni || "Desconocido");

        req.user = verified;
        next();
    } catch (err) {
        console.error(`⚠️ Error al verificar token (${req.ip} - ${req.originalUrl}):`, err.name, "-", err.message);
        
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expirado. Inicia sesión nuevamente." });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(403).json({ success: false, message: "Token inválido." });
        } else {
            return res.status(500).json({ success: false, message: "Error en la autenticación." });
        }
    }
};

module.exports = verifyToken;
