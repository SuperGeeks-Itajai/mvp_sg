const express = require("express");
const { Aula } = require("../models");
const autenticarToken = require("../middlewares/authMiddleware");
const verificarPapel = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * 📘 GET /aulas
 * Lista todas as aulas (aluno e funcionário podem ver)
 */
router.get("/", autenticarToken, async (req, res) => {
  try {
    const aulas = await Aula.findAll({ order: [["id", "ASC"]] });
    res.json(aulas);
  } catch (error) {
    console.error("Erro ao buscar aulas:", error);
    res.status(500).json({ error: "Erro ao buscar aulas." });
  }
});

/**
 * 📘 GET /aulas/:id
 * Detalha uma aula específica (aluno e funcionário podem ver)
 */
router.get("/:id", autenticarToken, async (req, res) => {
  try {
    const aula = await Aula.findByPk(req.params.id);
    if (!aula) {
      return res.status(404).json({ error: "Aula não encontrada." });
    }
    res.json(aula);
  } catch (error) {
    console.error("Erro ao buscar aula:", error);
    res.status(500).json({ error: "Erro ao buscar aula." });
  }
});

/**
 * 🧱 POST /aulas
 * Cria uma nova aula (somente funcionário)
 */
router.post("/", autenticarToken, verificarPapel("funcionario"), async (req, res) => {
  try {
    const { modulo_id, titulo, conteudo, ordem, resumo } = req.body;

    if (!modulo_id || !titulo || !ordem) {
      return res.status(400).json({ error: "Campos obrigatórios: modulo_id, titulo, ordem." });
    }

    const aula = await Aula.create({
      modulo_id,
      titulo,
      conteudo,
      ordem,
      resumo,
    });

    res.status(201).json(aula);
  } catch (error) {
    console.error("Erro ao criar aula:", error);
    res.status(500).json({ error: "Erro ao criar aula." });
  }
});

/**
 * ✏️ PUT /aulas/:id
 * Atualiza uma aula (somente funcionário)
 */
router.put("/:id", autenticarToken, verificarPapel("funcionario"), async (req, res) => {
  try {
    const { modulo_id, titulo, conteudo, ordem, resumo } = req.body;
    const aula = await Aula.findByPk(req.params.id);

    if (!aula) {
      return res.status(404).json({ error: "Aula não encontrada." });
    }

    await aula.update({ modulo_id, titulo, conteudo, ordem, resumo });
    res.json({ message: "Aula atualizada com sucesso!", aula });
  } catch (error) {
    console.error("Erro ao atualizar aula:", error);
    res.status(500).json({ error: "Erro ao atualizar aula." });
  }
});

/**
 * ❌ DELETE /aulas/:id
 * Exclui uma aula (somente funcionário)
 */
router.delete("/:id", autenticarToken, verificarPapel("funcionario"), async (req, res) => {
  try {
    const aula = await Aula.findByPk(req.params.id);
    if (!aula) {
      return res.status(404).json({ error: "Aula não encontrada." });
    }

    await aula.destroy();
    res.json({ message: "Aula excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir aula:", error);
    res.status(500).json({ error: "Erro ao excluir aula." });
  }
});

module.exports = router;
