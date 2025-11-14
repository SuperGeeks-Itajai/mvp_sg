const express = require("express");
const { sequelize } = require("./src/models");

// Rotas
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const historicoRoutes = require("./src/routes/historicoRoutes");
const moduloRoutes = require("./src/routes/moduloRoutes");
const aulaRoutes = require("./src/routes/aulaRoutes");
const funcionarioRoutes = require("./src/routes/funcionarioRoutes");

// CORS
const cors = require("cors");
const getCorsOptions = require("./src/config/corsConfig");

// Middleware global de erros
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

// Middlewares globais
app.use(cors(getCorsOptions()));
app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/historico", historicoRoutes);
app.use("/modulos", moduloRoutes);
app.use("/aulas", aulaRoutes);
app.use("/funcionarios", funcionarioRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.send("🚀 Servidor do MVP Escolar rodando com PostgreSQL + Sequelize!");
});

// ⛔ É MUITO IMPORTANTE: o middleware de erro sempre por último
app.use(errorHandler);

module.exports = app;
