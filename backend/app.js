const express = require("express");
const { sequelize } = require("./src/models");

// Rotas
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const historicoRoutes = require("./src/routes/historicoRoutes");
const moduloRoutes = require("./src/routes/moduloRoutes");
const aulaRoutes = require("./src/routes/aulaRoutes");
const funcionarioRoutes = require("./src/routes/funcionarioRoutes");
const authRoutes = require("./src/routes/authRoutes"); // ⬅️ faltava importar!!

// CORS
const cors = require("cors");
const getCorsOptions = require("./src/config/corsConfig");

// Middleware global de erros
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

// 🟢 CORS — precisa vir antes de tudo
app.use(cors(getCorsOptions()));

// Permite JSON
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);              // 👈 estava faltando!
app.use("/usuarios", usuarioRoutes);
app.use("/historico", historicoRoutes);
app.use("/modulos", moduloRoutes);
app.use("/aulas", aulaRoutes);
app.use("/funcionarios", funcionarioRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.send("🚀 Servidor do MVP Escolar rodando com PostgreSQL + Sequelize!");
});

// ⛔ O middleware de erro sempre por último
app.use(errorHandler);

module.exports = app;
