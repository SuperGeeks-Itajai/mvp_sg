import { useEffect, useState } from "react";

type Modulo = {
  id: number;
  nome: string;
  descricao: string;
};

export default function GerenciarModulos() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);

  // Criação
  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  // Edição
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");

  const token = localStorage.getItem("token");

  async function carregarModulos() {
    try {
      const res = await fetch("http://localhost:3000/modulos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar módulos");

      const data = await res.json();
      setModulos(data);
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarModulos();
  }, []);

  async function criarModulo() {
    if (!novoNome.trim()) return alert("O nome é obrigatório.");

    try {
      const res = await fetch("http://localhost:3000/modulos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: novoNome,
          descricao: novaDescricao,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar módulo");

      setNovoNome("");
      setNovaDescricao("");
      carregarModulos();
    } catch (error) {
      console.error("Erro ao criar módulo:", error);
    }
  }

  async function excluirModulo(id: number) {
    if (!confirm("Tem certeza que deseja excluir este módulo?")) return;

    try {
      const res = await fetch(`http://localhost:3000/modulos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir módulo");

      carregarModulos();
    } catch (error) {
      console.error("Erro ao excluir módulo:", error);
    }
  }

  async function salvarEdicao() {
    if (!editId || !editNome.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/modulos/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: editNome,
          descricao: editDescricao,
        }),
      });

      if (!res.ok) throw new Error("Erro ao editar módulo");

      setEditId(null);
      carregarModulos();
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  }

  if (loading) return <p>Carregando módulos...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: "#b30000" }}>
        📘 Gerenciar Módulos
      </h2>

      {/* Criar módulo */}
      <div className="card p-3 mb-4 shadow-sm">
        <h4 className="mb-3">Criar novo módulo</h4>

        <input
          className="form-control mb-2"
          placeholder="Nome do módulo"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Descrição do módulo"
          value={novaDescricao}
          onChange={(e) => setNovaDescricao(e.target.value)}
        />

        <button className="btn btn-danger mt-2" onClick={criarModulo}>
          Criar Módulo
        </button>
      </div>

      {/* Tabela de módulos */}
      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th style={{ width: "180px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {modulos.map((mod) => (
            <tr key={mod.id}>
              <td>
                {editId === mod.id ? (
                  <input
                    className="form-control"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />
                ) : (
                  mod.nome
                )}
              </td>

              <td>
                {editId === mod.id ? (
                  <textarea
                    className="form-control"
                    value={editDescricao}
                    onChange={(e) => setEditDescricao(e.target.value)}
                  />
                ) : (
                  mod.descricao
                )}
              </td>

              <td>
                {editId === mod.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={salvarEdicao}
                    >
                      Salvar
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditId(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setEditId(mod.id);
                        setEditNome(mod.nome);
                        setEditDescricao(mod.descricao);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => excluirModulo(mod.id)}
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

      {modulos.length === 0 && (
        <p className="text-muted text-center mt-3">Nenhum módulo cadastrado.</p>
      )}
    </div>
  );
}
