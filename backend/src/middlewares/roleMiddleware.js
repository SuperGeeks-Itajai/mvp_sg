module.exports = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const tipo = req.user?.tipo;

    if (!tipo) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (!rolesPermitidos.includes(tipo)) {
      return res.status(403).json({ error: "Permissão insuficiente." });
    }

    next();
  };
};
