const express = require("express");
const { Modulo } = require("../models");
const autenticarToken = require("../middlewares/authMiddleware");
const autorizarTipos = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * GET /modulos
 * Aluno e Funcionário podem listar todos os módulos
 */
router.get("/", autenticarToken, autorizarTipos(["aluno", "funcionario"]), async (req, res) => {
  try {
    const modulos = await Modulo.findAll();
    res.json(modulos);
  } catch (error) {
    console.error("Erro ao listar módulos:", error);
    res.status(500).json({ error: "Erro ao listar módulos" });
  }
});

/**
 * GET /modulos/:id
 * Aluno e Funcionário podem ver um módulo específico
 */
router.get("/:id", autenticarToken, autorizarTipos(["aluno", "funcionario"]), async (req, res) => {
  try {
    const modulo = await Modulo.findByPk(req.params.id);
    if (!modulo) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }
    res.json(modulo);
  } catch (error) {
    console.error("Erro ao buscar módulo:", error);
    res.status(500).json({ error: "Erro ao buscar módulo" });
  }
});

/**
 * POST /modulos
 * Apenas Funcionário pode criar
 */
router.post("/", autenticarToken, autorizarTipos(["funcionario"]), async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const modulo = await Modulo.create({ nome, descricao });
    res.status(201).json(modulo);
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    res.status(500).json({ error: "Erro ao criar módulo" });
  }
});

/**
 * PUT /modulos/:id
 * Apenas Funcionário pode atualizar
 */
router.put("/:id", autenticarToken, autorizarTipos(["funcionario"]), async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const modulo = await Modulo.findByPk(req.params.id);

    if (!modulo) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }

    modulo.nome = nome || modulo.nome;
    modulo.descricao = descricao || modulo.descricao;
    await modulo.save();

    res.json(modulo);
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    res.status(500).json({ error: "Erro ao atualizar módulo" });
  }
});

/**
 * DELETE /modulos/:id
 * Apenas Funcionário pode excluir
 */
router.delete("/:id", autenticarToken, autorizarTipos(["funcionario"]), async (req, res) => {
  try {
    const modulo = await Modulo.findByPk(req.params.id);

    if (!modulo) {
      return res.status(404).json({ error: "Módulo não encontrado" });
    }

    await modulo.destroy();
    res.json({ message: "Módulo excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir módulo:", error);
    res.status(500).json({ error: "Erro ao excluir módulo" });
  }
});

module.exports = router;
