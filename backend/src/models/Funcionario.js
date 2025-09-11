const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Definindo o model Funcionario
const Funcionario = sequelize.define(
  "Funcionario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "usuario",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    cargo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "funcionario",
    schema: "escola",
    timestamps: false,
  }
);

module.exports = Funcionario;
