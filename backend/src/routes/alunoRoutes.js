const express = require("express");
const { Aluno, Usuario, Modulo } = require("../models");
const autenticarToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * GET /alunos/me
 * Aluno vê apenas seu próprio perfil + dados extras
 */
router.get("/me", autenticarToken, async (req, res) => {
  try {
    if (req.usuario.tipo !== "aluno") {
      return res.status(403).json({ error: "Acesso negado: apenas alunos" });
    }

    const aluno = await Aluno.findOne({
      where: { id: req.usuario.id },
      include: [
        {
          model: Usuario,
          attributes: ["id", "nome", "email", "tipo", "criado_em"],
        },
        {
          model: Modulo,
          attributes: ["id", "nome", "descricao"],
        },
      ],
    });

    if (!aluno) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    res.json(aluno);
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    res.status(500).json({ error: "Erro interno ao buscar aluno" });
  }
});

module.exports = router;
