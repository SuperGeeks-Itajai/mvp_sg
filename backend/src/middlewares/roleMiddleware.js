// Middleware para verificar se o usuário logado tem o tipo correto
function autorizarTipos(...tiposPermitidos) {
  return (req, res, next) => {
    const { usuario } = req; // vem do autenticarToken (JWT)

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!tiposPermitidos.includes(usuario.tipo)) {
      return res.status(403).json({ error: "Acesso negado: permissão insuficiente" });
    }

    next(); // tudo certo, segue para a rota
  };
}

module.exports = autorizarTipos;
