const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware"); // ⬅ NECESSÁRIO

const router = express.Router();

/* ---------------------------------------------
   POST /auth/login  → autenticação do usuário
----------------------------------------------*/
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET || "segredo_super_secreto",
      { expiresIn: "1h" }
    );

    const { senha: _, ...dadosUsuario } = usuario.toJSON();

    res.json({ usuario: dadosUsuario, token });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no login" });
  }
});

/* ---------------------------------------------
   GET /auth/me  → retorna informações do usuário logado
   (somente se enviar Authorization: Bearer TOKEN)
----------------------------------------------*/
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id", "nome", "email", "tipo"],
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(usuario);

  } catch (error) {
    console.error("Erro no /auth/me:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

module.exports = router;
