const express = require("express");
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const validarCampos = require("../middlewares/validationMiddleware");
const { Usuario, Aluno, Funcionario } = require("../models");
const autenticarToken = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * ✅ POST /usuarios
 * Cria novo usuário (aluno ou funcionário)
 * - Cria registro base em "usuario"
 * - Se for aluno, cria também em "aluno"
 * - Se for funcionário, cria também em "funcionario"
 */
router.post(
  "/",
  [
    body("nome").notEmpty().withMessage("O nome é obrigatório."),
    body("email").isEmail().withMessage("Email inválido."),
    body("senha")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres."),
    body("tipo")
      .isIn(["aluno", "funcionario"])
      .withMessage("O tipo deve ser 'aluno' ou 'funcionario'."),
  ],
  validarCampos,
  async (req, res) => {
    try {
      const { nome, email, senha, tipo, turma, modulo_atual, cargo } = req.body;

      const hashedPassword = await bcrypt.hash(senha, 10);

      const usuario = await Usuario.create({
        nome,
        email,
        senha: hashedPassword,
        tipo,
      });

      // Garantia de integridade — cria entrada em aluno se ainda não existir
      if (tipo === "aluno") {
        const alunoExistente = await Aluno.findByPk(usuario.id);
        if (!alunoExistente) {
          await Aluno.create({
            id: usuario.id,
            turma: turma || null,
            modulo_atual: modulo_atual || null,
          });
        }
      }

      if (tipo === "funcionario") {
        await Funcionario.create({
          id: usuario.id,
          cargo: cargo || "Não definido",
        });
      }

      res.status(201).json({
        message: "Usuário criado com sucesso!",
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        },
      });
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }
);

/**
 * ✅ GET /usuarios
 * Funcionário → lista todos
 * Aluno → vê apenas seu próprio perfil
 */
router.get("/", autenticarToken, async (req, res) => {
  try {
    const user = req.user;

    if (user.tipo === "funcionario") {
      const usuarios = await Usuario.findAll({
        attributes: ["id", "nome", "email", "tipo", "criado_em"],
        order: [["id", "ASC"]],
      });
      return res.json(usuarios);
    }

    if (user.tipo === "aluno") {
      const usuario = await Usuario.findByPk(user.id, {
        attributes: ["id", "nome", "email", "tipo", "criado_em"],
      });
      return res.json(usuario);
    }

    res.status(403).json({ error: "Tipo de usuário não autorizado." });
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

/**
 * ✅ GET /usuarios/:id
 * Funcionário → pode consultar qualquer usuário pelo ID
 */
router.get("/:id", autenticarToken, roleMiddleware(["funcionario"]), async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ["id", "nome", "email", "tipo", "criado_em"],
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(usuario);
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

/**
 * ✅ PUT /usuarios/:id
 * Funcionário → pode editar qualquer usuário
 * Aluno → pode editar apenas seu próprio nome e senha
 */
router.put(
  "/:id",
  autenticarToken,
  [
    body("nome").optional().notEmpty().withMessage("O nome não pode ser vazio."),
    body("email").optional().isEmail().withMessage("Email inválido."),
    body("senha")
      .optional()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres."),
  ],
  validarCampos,
  async (req, res) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const { nome, email, senha, tipo } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // 🔒 Aluno só pode editar o próprio perfil
      if (user.tipo === "aluno" && user.id !== parseInt(id)) {
        return res.status(403).json({ error: "Permissão negada." });
      }

      // 🔒 Aluno não pode mudar tipo nem email de outro usuário
      if (user.tipo === "aluno") {
        usuario.nome = nome || usuario.nome;
        if (senha) {
          usuario.senha = await bcrypt.hash(senha, 10);
        }
      } else if (user.tipo === "funcionario") {
        // Funcionário pode alterar tudo
        usuario.nome = nome || usuario.nome;
        usuario.email = email || usuario.email;
        usuario.tipo = tipo || usuario.tipo;
        if (senha) {
          usuario.senha = await bcrypt.hash(senha, 10);
        }
      }

      await usuario.save();

      res.json({
        message: "Usuário atualizado com sucesso!",
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        },
      });
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }
);

/**
 * ✅ DELETE /usuarios/:id
 * Funcionário → pode excluir qualquer usuário
 */
router.delete("/:id", autenticarToken, roleMiddleware(["funcionario"]), async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await usuario.destroy();

    res.json({ message: "Usuário removido com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

module.exports = router;
