const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Aula = sequelize.define(
  "Aula",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modulo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "modulo",
        key: "id",
      },
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    conteudo: {
      type: DataTypes.TEXT,
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resumo: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "aula",
    schema: "escola",
    timestamps: false,
  }
);

module.exports = Aula;
