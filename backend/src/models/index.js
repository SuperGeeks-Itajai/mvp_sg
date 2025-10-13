const sequelize = require("../config/database");

const Usuario = require("./Usuario");
const Modulo = require("./Modulo");
const Aluno = require("./Aluno");
const Funcionario = require("./Funcionario");
const Aula = require("./Aula");
const Historico = require("./Historico");

// Associações
Aluno.belongsTo(Usuario, { foreignKey: "id" });
Aluno.belongsTo(Modulo, { foreignKey: "modulo_atual" });
Funcionario.belongsTo(Usuario, { foreignKey: "id" });
Aula.belongsTo(Modulo, { foreignKey: "modulo_id" });
Historico.belongsTo(Aluno, { foreignKey: "aluno_id" });
Historico.belongsTo(require("./Aula"), { foreignKey: "aula_id" });

// Exporta
module.exports = {
  sequelize,
  Usuario,
  Modulo,
  Aluno,
  Funcionario,
  Aula,
  Historico,
};
