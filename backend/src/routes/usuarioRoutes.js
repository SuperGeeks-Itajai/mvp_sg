const express = require("express");
const bcrypt = require("bcryptjs");
const { Usuario, Aluno, Funcionario } = require("../models");

const router = express.Router();

/**
 * POST /usuarios
 * Cadastrar novo usuário
 * - Se tipo = aluno → cria também em tabela aluno
 * - Se tipo = funcionario → cria também em tabela funcionario
 */
router.post("/", async (req, res) => {
  try {
    const { nome, email, senha, tipo, turma, modulo_atual, cargo } = req.body;

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o usuario
    const usuario = await Usuario.create({
      nome,
      email,
      senha: hashedPassword,
      tipo,
    });

    // Se for aluno, cria na tabela aluno
    if (tipo === "aluno") {
      await Aluno.create({
        id: usuario.id,       // mesmo id de usuario
        turma: turma || null,
        modulo_atual: modulo_atual || null,
      });
    }

    // Se for funcionario, cria na tabela funcionario
    if (tipo === "funcionario") {
      await Funcionario.create({
        id: usuario.id,       // mesmo id de usuario
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
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

module.exports = router;
