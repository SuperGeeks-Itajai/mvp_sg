const sequelize = require("../config/database");

const Usuario = require("./Usuario");
const Modulo = require("./Modulo");
const Aluno = require("./Aluno");
const Funcionario = require("./Funcionario");
const Aula = require("./Aula");

// Associações
Aluno.belongsTo(Usuario, { foreignKey: "id" });
Aluno.belongsTo(Modulo, { foreignKey: "modulo_atual" });
Funcionario.belongsTo(Usuario, { foreignKey: "id" });
Aula.belongsTo(Modulo, { foreignKey: "modulo_id" });

// Exporta
module.exports = {
  sequelize,
  Usuario,
  Modulo,
  Aluno,
  Funcionario,
  Aula,
};
