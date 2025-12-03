const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

// Usa o mesmo segredo padrão do login, garantindo compatibilidade
const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

module.exports = async function autenticarToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    // Formato esperado: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token ausente no cabeçalho." });
    }

    // 🔍 Verifica token JWT com o mesmo segredo usado para assiná-lo
    const decoded = jwt.verify(token, JWT_SECRET);

    // Busca o usuário pelo ID armazenado no token
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    // Injeta dados do usuário no req para uso nas rotas
    req.user = {
      id: usuario.id,
      tipo: usuario.tipo,
      email: usuario.email,
      nome: usuario.nome
    };

    console.log(`🔐 Usuário autenticado: ${usuario.id} (${usuario.tipo})`);

    next();
  } catch (error) {
    console.error("❌ Erro na autenticação:", error);
    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
};
