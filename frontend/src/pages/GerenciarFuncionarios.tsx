import { useEffect, useState } from "react";

type Funcionario = {
  id: number;
  nome: string;
  email: string;
  tipo: string;
};

export default function GerenciarFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para criação
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");

  // Estados para edição
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const token = localStorage.getItem("token");

  // Buscar funcionários
  async function carregarFuncionarios() {
    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Erro ao carregar usuários");
      }

      const data = await res.json();

      const somenteFuncionarios = data.filter(
        (u: Funcionario) => u.tipo === "funcionario"
      );

      setFuncionarios(somenteFuncionarios);
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  // Criar novo funcionário
  async function criarFuncionario() {
    if (!novoNome || !novoEmail) return alert("Preencha todos os campos!");

    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: novoNome,
          email: novoEmail,
          senha: "123456", // senha padrão (pode mudar)
          tipo: "funcionario",
        }),
      });

      if (!res.ok) {
        const texto = await res.text();
        throw new Error(texto);
      }

      setNovoNome("");
      setNovoEmail("");
      carregarFuncionarios();
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
    }
  }

  // Excluir funcionário
  async function excluirFuncionario(id: number) {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir");

      carregarFuncionarios();
    } catch (err) {
      console.error("Erro ao excluir funcionário:", err);
    }
  }

  // Salvar edição
  async function salvarEdicao() {
    if (!editNome || !editEmail || !editandoId) return;

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: editNome,
          email: editEmail,
        }),
      });

      if (!res.ok) throw new Error("Erro ao editar");

      setEditandoId(null);
      carregarFuncionarios();
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
    }
  }

  if (loading) return <p>Carregando funcionários...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: "#b30000" }}>
        👨‍💼 Gerenciar Funcionários
      </h2>

      {/* Criar funcionário */}
      <div className="card p-3 mb-4 shadow-sm">
        <h4 className="mb-3">Cadastrar novo funcionário</h4>

        <input
          className="form-control mb-2"
          placeholder="Nome"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={novoEmail}
          onChange={(e) => setNovoEmail(e.target.value)}
        />

        <button className="btn btn-danger mt-2" onClick={criarFuncionario}>
          Criar Funcionário
        </button>
      </div>

      {/* Lista */}
      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th style={{ width: "180px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((func) => (
            <tr key={func.id}>
              <td>
                {editandoId === func.id ? (
                  <input
                    className="form-control"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />
                ) : (
                  func.nome
                )}
              </td>

              <td>
                {editandoId === func.id ? (
                  <input
                    className="form-control"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                ) : (
                  func.email
                )}
              </td>

              <td>
                {editandoId === func.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={salvarEdicao}
                    >
                      Salvar
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditandoId(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setEditandoId(func.id);
                        setEditNome(func.nome);
                        setEditEmail(func.email);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => excluirFuncionario(func.id)}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
