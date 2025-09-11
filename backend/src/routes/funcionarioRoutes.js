const express = require("express");
const { Funcionario, Usuario } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * GET /funcionarios/me
 * Retorna os dados do funcionário logado
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (req.usuario.tipo !== "funcionario") {
      return res.status(403).json({ error: "Acesso permitido apenas para funcionários" });
    }

    const funcionario = await Funcionario.findOne({
      where: { id: req.usuario.id },
      include: [{ model: Usuario, attributes: ["id", "nome", "email", "tipo"] }],
    });

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    res.json(funcionario);
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    res.status(500).json({ error: "Erro ao buscar funcionário" });
  }
});

module.exports = router;
