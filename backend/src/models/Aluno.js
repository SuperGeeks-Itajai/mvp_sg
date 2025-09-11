const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Definindo o model Aluno
const Aluno = sequelize.define(
  "Aluno",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "usuario", // nome da tabela alvo
        key: "id",
      },
      onDelete: "CASCADE",
    },
    turma: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    modulo_atual: {
      type: DataTypes.INTEGER,
      references: {
        model: "modulo",
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    tableName: "aluno",
    schema: "escola",
    timestamps: false,
  }
);

module.exports = Aluno;
