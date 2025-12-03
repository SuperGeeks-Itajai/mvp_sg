import { useEffect, useState } from "react";

type Aluno = {
  id: number;
  nome: string;
  email: string;
  tipo: string;
};

export default function GerenciarAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do formulário de criação
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");

  // Estados para edição
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const token = localStorage.getItem("token");

  // Buscar alunos
  async function carregarAlunos() {
    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar usuários");

      const data = await res.json();

      const somenteAlunos = data.filter((u: Aluno) => u.tipo === "aluno");

      setAlunos(somenteAlunos);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlunos();
  }, []);

  // Criar aluno
  async function criarAluno() {
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
          senha: "123456", // senha default (pode mudar)
          tipo: "aluno",
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar aluno");

      setNovoNome("");
      setNovoEmail("");
      carregarAlunos();
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
    }
  }

  // Excluir aluno
  async function excluirAluno(id: number) {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir aluno");

      carregarAlunos();
    } catch (err) {
      console.error("Erro ao excluir aluno:", err);
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
      carregarAlunos();
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
    }
  }

  if (loading) return <p>Carregando alunos...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: "#b30000" }}>
        🎓 Gerenciar Alunos
      </h2>

      {/* Criar aluno */}
      <div className="card p-3 mb-4 shadow-sm">
        <h4 className="mb-3">Cadastrar novo aluno</h4>

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

        <button className="btn btn-danger mt-2" onClick={criarAluno}>
          Criar Aluno
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
          {alunos.map((aluno) => (
            <tr key={aluno.id}>
              <td>
                {editandoId === aluno.id ? (
                  <input
                    className="form-control"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />
                ) : (
                  aluno.nome
                )}
              </td>

              <td>
                {editandoId === aluno.id ? (
                  <input
                    className="form-control"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                ) : (
                  aluno.email
                )}
              </td>

              <td>
                {editandoId === aluno.id ? (
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
                        setEditandoId(aluno.id);
                        setEditNome(aluno.nome);
                        setEditEmail(aluno.email);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => excluirAluno(aluno.id)}
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
