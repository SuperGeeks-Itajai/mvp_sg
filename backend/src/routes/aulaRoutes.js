const express = require("express");
const { Aula, Modulo } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * GET /aulas
 * Lista todas as aulas (aluno e funcionário podem ver)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const aulas = await Aula.findAll({ include: [{ model: Modulo }] });
    res.json(aulas);
  } catch (error) {
    console.error("Erro ao listar aulas:", error);
    res.status(500).json({ error: "Erro ao listar aulas" });
  }
});

/**
 * GET /aulas/:id
 * Detalhes de uma aula
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const aula = await Aula.findByPk(req.params.id, { include: [Modulo] });
    if (!aula) return res.status(404).json({ error: "Aula não encontrada" });
    res.json(aula);
  } catch (error) {
    console.error("Erro ao buscar aula:", error);
    res.status(500).json({ error: "Erro ao buscar aula" });
  }
});

/**
 * POST /aulas
 * Criar nova aula (apenas funcionário)
 */
router.post("/", authMiddleware, roleMiddleware("funcionario"), async (req, res) => {
  try {
    const { modulo_id, titulo, conteudo, ordem, resumo } = req.body;
    const aula = await Aula.create({ modulo_id, titulo, conteudo, ordem, resumo });
    res.status(201).json(aula);
  } catch (error) {
    console.error("Erro ao criar aula:", error);
    res.status(500).json({ error: "Erro ao criar aula" });
  }
});

/**
 * PUT /aulas/:id
 * Atualizar aula (apenas funcionário)
 */
router.put("/:id", authMiddleware, roleMiddleware("funcionario"), async (req, res) => {
  try {
    const aula = await Aula.findByPk(req.params.id);
    if (!aula) return res.status(404).json({ error: "Aula não encontrada" });

    const { modulo_id, titulo, conteudo, ordem, resumo } = req.body;
    await aula.update({ modulo_id, titulo, conteudo, ordem, resumo });
    res.json(aula);
  } catch (error) {
    console.error("Erro ao atualizar aula:", error);
    res.status(500).json({ error: "Erro ao atualizar aula" });
  }
});

/**
 * DELETE /aulas/:id
 * Remover aula (apenas funcionário)
 */
router.delete("/:id", authMiddleware, roleMiddleware("funcionario"), async (req, res) => {
  try {
    const aula = await Aula.findByPk(req.params.id);
    if (!aula) return res.status(404).json({ error: "Aula não encontrada" });

    await aula.destroy();
    res.json({ message: "Aula excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir aula:", error);
    res.status(500).json({ error: "Erro ao excluir aula" });
  }
});

module.exports = router;
