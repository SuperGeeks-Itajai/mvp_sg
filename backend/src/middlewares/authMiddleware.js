const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

module.exports = async function autenticarToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    // Extrai token de "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token ausente no cabeçalho." });
    }

    // Verifica token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca usuário no banco
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    // ✅ Injeta informações no request (acessível em qualquer rota)
    req.user = {
      id: usuario.id,
      tipo: usuario.tipo,
      email: usuario.email,
    };

    console.log(`🔐 Usuário autenticado: ${usuario.id} (${usuario.tipo})`);
    next(); // segue para o próximo middleware
  } catch (error) {
    console.error("❌ Erro na autenticação:", error);
    res.status(403).json({ error: "Token inválido ou expirado." });
  }
};
