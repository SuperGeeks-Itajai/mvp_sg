const express = require("express");
const { Historico, Aula, Usuario } = require("../models");
const autenticarToken = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * ✅ POST /historico/:aulaId
 * Aluno marca uma aula como concluída
 */
router.post("/:aulaId", autenticarToken, roleMiddleware(["aluno"]), async (req, res) => {
  try {
    const { aulaId } = req.params;
    const userId = req.user.id;

    // Verifica se aula existe
    const aula = await Aula.findByPk(aulaId);
    if (!aula) return res.status(404).json({ error: "Aula não encontrada." });

    // Verifica se já está marcada como concluída
    const existente = await Historico.findOne({
      where: { aluno_id: userId, aula_id: aulaId },
    });
    if (existente) return res.status(400).json({ error: "Aula já concluída anteriormente." });

    // Cria novo registro de conclusão
    const novoHistorico = await Historico.create({
      aluno_id: userId,
      aula_id: aulaId,
      concluido_em: new Date(), // 🔧 corrigido (era concluida_em)
    });

    res.status(201).json({
      message: "✅ Aula marcada como concluída!",
      historico: novoHistorico,
    });
  } catch (err) {
    console.error("❌ Erro ao marcar aula como concluída:", err);
    res.status(500).json({ error: "Erro ao marcar aula como concluída." });
  }
});

/**
 * ✅ GET /historico/me
 * Aluno vê seu próprio histórico de aulas concluídas
 */
router.get("/me", autenticarToken, roleMiddleware(["aluno"]), async (req, res) => {
  try {
    const historico = await Historico.findAll({
      where: { aluno_id: req.user.id },
      include: [
        {
          model: Aula,
          attributes: ["id", "titulo", "modulo_id", "ordem"],
        },
      ],
      order: [["concluido_em", "DESC"]],
    });

    res.json(historico);
  } catch (err) {
    console.error("❌ Erro ao buscar histórico:", err);
    res.status(500).json({ error: "Erro ao buscar histórico." });
  }
});

/**
 * ✅ GET /historico/:alunoId
 * Funcionário visualiza histórico de um aluno específico
 */
router.get("/:alunoId", autenticarToken, roleMiddleware(["funcionario"]), async (req, res) => {
  try {
    const { alunoId } = req.params;

    const aluno = await Usuario.findByPk(alunoId);
    if (!aluno || aluno.tipo !== "aluno") {
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    const historico = await Historico.findAll({
      where: { aluno_id: alunoId },
      include: [
        {
          model: Aula,
          attributes: ["id", "titulo", "modulo_id", "ordem"],
        },
      ],
      order: [["concluido_em", "DESC"]],
    });

    res.json({
      aluno: aluno.nome,
      total_concluidas: historico.length,
      aulas: historico,
    });
  } catch (err) {
    console.error("❌ Erro ao buscar histórico do aluno:", err);
    res.status(500).json({ error: "Erro ao buscar histórico do aluno." });
  }
});

/**
 * ✅ DELETE /historico/:id
 * Funcionário pode remover um registro de histórico (caso tenha sido marcado por engano)
 */
router.delete("/:id", autenticarToken, roleMiddleware(["funcionario"]), async (req, res) => {
  try {
    const { id } = req.params;

    const historico = await Historico.findByPk(id);
    if (!historico) {
      return res.status(404).json({ error: "Registro de histórico não encontrado." });
    }

    await historico.destroy();

    res.json({ message: "🗑️ Registro de histórico removido com sucesso." });
  } catch (err) {
    console.error("❌ Erro ao deletar histórico:", err);
    res.status(500).json({ error: "Erro ao deletar histórico." });
  }
});

module.exports = router;
