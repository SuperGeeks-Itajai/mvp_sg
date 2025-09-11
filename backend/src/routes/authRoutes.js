const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const router = express.Router();

// POST /login → autentica usuário e devolve token JWT
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Verifica se os campos vieram
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // 2. Busca usuário no banco
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // 3. Compara a senha enviada com a senha criptografada no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // 4. Gera o token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        tipo: usuario.tipo, // 👈 assim podemos diferenciar aluno/funcionário
      },
      process.env.JWT_SECRET || "segredo_super_secreto", // chave secreta
      { expiresIn: "1h" } // expira em 1 hora
    );

    // 5. Retorna token e dados básicos do usuário
    const { senha: _, ...dadosUsuario } = usuario.toJSON();
    res.json({ usuario: dadosUsuario, token });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;
