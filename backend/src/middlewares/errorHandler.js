/**
 * 🧱 Middleware global de tratamento de erros.
 * - Captura erros lançados por rotas e middlewares
 * - Padroniza resposta JSON
 * - Oculta detalhes técnicos em produção
 */
module.exports = (err, req, res, next) => {
  console.error("🔥 ERRO CAPTURADO GLOBALMENTE:", err);

  // Status padrão
  const statusCode = err.statusCode || 500;

  // Mensagem de erro "segura" para o cliente
  const mensagem =
    process.env.NODE_ENV === "production"
      ? "Ocorreu um erro interno. Tente novamente mais tarde."
      : err.message || "Erro desconhecido.";

  // Caso especial: erro de validação do Sequelize
  if (err.name === "SequelizeValidationError") {
    const mensagens = err.errors.map((e) => e.message);
    return res.status(400).json({
      error: "Erro de validação.",
      detalhes: mensagens,
    });
  }

  // Caso especial: erro de chave estrangeira
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      error: "Violação de integridade referencial.",
      detalhes: err.parent?.detail || "Verifique as relações do banco.",
    });
  }

  // Retorno padrão
  res.status(statusCode).json({
    error: mensagem,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};