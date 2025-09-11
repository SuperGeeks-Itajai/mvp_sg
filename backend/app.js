const express = require("express");
const { sequelize } = require("./src/models");
const usuarioRoutes = require("./src/routes/usuarioRoutes");

const app = express();
app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.send("🚀 Servidor do MVP Escolar rodando com PostgreSQL + Sequelize!");
});

module.exports = app;
