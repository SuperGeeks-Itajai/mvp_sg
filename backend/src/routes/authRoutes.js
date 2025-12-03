const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const autenticarToken = require("../middlewares/authMiddleware");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

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
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { senha: _, ...userData } = usuario.toJSON();
    res.json({ usuario: userData, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no login" });
  }
});

// --- ME (pega dados do usuário logado) ---
router.get("/me", autenticarToken, async (req, res) => {
  res.json({ usuario: req.user });
});

module.exports = router;
