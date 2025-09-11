const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Definindo o model Modulo
const Modulo = sequelize.define(
  "Modulo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "modulo", // nome da tabela no banco
    schema: "escola",    // schema definido no SQL
    timestamps: false,   // não cria colunas automáticas
  }
);

module.exports = Modulo;
