const express = require("express");
const { Historico, Aula } = require("../models");
const autenticarToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * POST /historico/:aulaId
 * Aluno marca uma aula como concluída
 */
router.post("/:aulaId", autenticarToken, async (req, res) => {
  try {
    const { aulaId } = req.params;

    // Só alunos podem marcar aulas
    if (req.user.tipo !== "aluno") {
      return res
        .status(403)
        .json({ error: "Somente alunos podem marcar aulas como concluídas." });
    }

    // Verifica se a aula existe
    const aula = await Aula.findByPk(aulaId);
    if (!aula) {
      return res.status(404).json({ error: "Aula não encontrada." });
    }

    // Cria registro no histórico
    const historico = await Historico.create({
      aluno_id: req.user.id, // vem do token
      aula_id: aulaId,
      concluido_em: new Date(),
    });

    res.status(201).json({
      message: "Aula concluída com sucesso!",
      historico,
    });
  } catch (error) {
    console.error("Erro ao concluir aula:", error);
    res.status(500).json({ error: "Erro ao marcar aula como concluída." });
  }
});

/**
 * GET /historico/me
 * Retorna todas as aulas concluídas do aluno logado
 */
router.get("/me", autenticarToken, async (req, res) => {
  try {
    // Apenas alunos podem ver o próprio histórico
    if (req.user.tipo !== "aluno") {
      return res
        .status(403)
        .json({ error: "Somente alunos podem acessar o histórico." });
    }

    const historico = await Historico.findAll({
      where: { aluno_id: req.user.id },
      include: [{ model: Aula }], // traz info da aula
    });

    res.json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro ao buscar histórico." });
  }
});

module.exports = router;
