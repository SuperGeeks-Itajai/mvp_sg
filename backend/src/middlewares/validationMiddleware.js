// src/middlewares/validationMiddleware.js
const { validationResult } = require("express-validator");

/**
 * Middleware genérico para verificar resultados de validação
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // retorna apenas as mensagens de erro
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        campo: err.param,
        mensagem: err.msg,
      })),
    });
  }

  next(); // passa para o controller se estiver tudo ok
};
