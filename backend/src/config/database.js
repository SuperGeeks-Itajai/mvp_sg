// Importa Sequelize da biblioteca
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Cria a conexão com o banco usando variáveis do .env
const sequelize = new Sequelize(
  process.env.DB_NAME,   // Nome do banco
  process.env.DB_USER,   // Usuário
  process.env.DB_PASS,   // Senha
  {
    host: process.env.DB_HOST, // Host (localhost ou IP)
    dialect: "postgres",       // Banco que estamos usando
    port: process.env.DB_PORT, // Porta padrão: 5432
    logging: false,            // Se true, mostra queries no console
    define: {
      schema: "escola",        // 👈 agora o Sequelize usa sempre o schema 'escola'
      timestamps: false        // não cria colunas automáticas createdAt/updatedAt
    }
  }
);

// Testa a conexão com o banco
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com banco estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco:", error);
  }
}

testConnection();

module.exports = sequelize;
