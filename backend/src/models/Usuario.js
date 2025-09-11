const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Definindo o model Usuario
const Usuario = sequelize.define(
  "Usuario",
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
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("aluno", "funcionario"),
      allowNull: false,
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "usuario", // nome da tabela real
    schema: "escola",     // schema que criamos no SQL
    timestamps: false,    // não cria colunas automáticas
  }
);

module.exports = Usuario;
