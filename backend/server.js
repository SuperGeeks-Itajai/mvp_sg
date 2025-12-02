const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// 🟢 Habilitar CORS corretamente
app.use(
  cors({
    origin: "http://localhost:5173", // ⬅️ sua aplicação React
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
  })
);

// Permite JSON
app.use(express.json());

// Importa rotas
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const authRoutes = require("./src/routes/authRoutes");
const moduloRoutes = require("./src/routes/moduloRoutes");
const alunoRoutes = require("./src/routes/alunoRoutes");
const funcionarioRoutes = require("./src/routes/funcionarioRoutes");
const aulaRoutes = require("./src/routes/aulaRoutes");
const historicoRoutes = require("./src/routes/historicoRoutes");

// Usa prefixo
app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);
app.use("/modulos", moduloRoutes);
app.use("/alunos", alunoRoutes);
app.use("/funcionarios", funcionarioRoutes);
app.use("/aulas", aulaRoutes);
app.use("/historico", historicoRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.send("🚀 Servidor do MVP rodando com PostgreSQL + Sequelize!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
