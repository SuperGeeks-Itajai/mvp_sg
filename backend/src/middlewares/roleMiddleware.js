module.exports = function verificarPapel(papelNecessario) {
  return (req, res, next) => {
    if (!req.user) {
      console.error("🚫 req.user está indefinido no roleMiddleware!");
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (req.user.tipo !== papelNecessario) {
      return res.status(403).json({ error: "Acesso negado: permissão insuficiente." });
    }

    next();
  };
};
