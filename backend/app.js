const express = require("express");
const { sequelize } = require("./src/models");
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.send("🚀 Servidor do MVP Escolar rodando com PostgreSQL + Sequelize!");
});

// 👇 Middleware global de erros (deve ficar *por último*)
app.use(errorHandler);

module.exports = app;
