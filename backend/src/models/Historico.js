const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Historico = sequelize.define(
  "Historico",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    aluno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    aula_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    concluido_em: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "historico",
    schema: "escola",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["aluno_id", "aula_id"], // garante que aluno não repita aula
      },
    ],
  }
);

module.exports = Historico;
