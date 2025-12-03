import { useEffect, useState } from "react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: "aluno";
};

type Modulo = {
  id: number;
  nome: string;
  descricao: string;
};

type AulaConcluida = {
  id: number;
  concluido_em: string;
  Aula: {
    id: number;
    titulo: string;
    modulo_id: number;
    ordem: number;
  };
};

export default function DashboardAluno() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [historico, setHistorico] = useState<AulaConcluida[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  async function loadData() {
    try {
      // ====== 1) CARREGA USUÁRIO ======
      const userRes = await fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userJson = await userRes.json();
      setUsuario(userJson.usuario); // <- Ajustado aqui!

      // ====== 2) MÓDULOS ======
      const modRes = await fetch("http://localhost:3000/modulos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const modData: Modulo[] = await modRes.json();
      setModulos(modData);

      // ====== 3) HISTÓRICO ======
      const histRes = await fetch("http://localhost:3000/historico/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const histData: AulaConcluida[] = await histRes.json();
      setHistorico(histData);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }

    setLoading(false);
  }

  // --- useEffect correto (sem warning do React) ---
  useEffect(() => {
    const carregar = async () => {
      await loadData();
    };

    carregar();
  }, []);

  if (loading)
    return <p className="text-center mt-5">Carregando...</p>;

  return (
    <div className="container-fluid bg-light min-vh-100 p-0">

      {/* Top bar */}
      <nav className="navbar navbar-dark bg-danger px-4">
        <span className="navbar-brand mb-0 h1 text-white">Portal do Aluno</span>
      </nav>

      <div className="row g-0">

        {/* Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 bg-black text-white p-3">
          <h5 className="text-center mb-4">Menu</h5>
          <ul className="list-group">
            <li className="list-group-item bg-black text-white border-secondary">
              Módulos
            </li>
            <li className="list-group-item bg-black text-white border-secondary">
              Aulas Concluídas
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="col-12 col-md-9 col-lg-10 p-4">
          <h2 className="fw-bold" style={{ color: "#b30000" }}>
            Bem-vindo, {usuario?.nome}!
          </h2>

          {/* MÓDULOS */}
          <div className="mt-4">
            <h3 style={{ color: "#b30000" }}>📘 Módulos Disponíveis</h3>
            <div className="row mt-3">
              {modulos.map((mod) => (
                <div key={mod.id} className="col-md-4">
                  <div className="card shadow-sm mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{mod.nome}</h5>
                      <p>{mod.descricao}</p>
                    </div>
                  </div>
                </div>
              ))}

              {modulos.length === 0 && (
                <p className="text-muted">Nenhum módulo disponível.</p>
              )}
            </div>
          </div>

          {/* HISTÓRICO */}
          <div className="mt-5">
            <h3 style={{ color: "#b30000" }}>📚 Aulas Concluídas</h3>

            {historico.length === 0 && (
              <p className="text-muted">Nenhuma aula concluída ainda.</p>
            )}

            <ul className="list-group mt-3">
              {historico.map((h) => (
                <li key={h.id} className="list-group-item">
                  <strong>{h.Aula.titulo}</strong>
                  <br />
                  <span className="text-muted">
                    Concluída em:{" "}
                    {new Date(h.concluido_em).toLocaleDateString("pt-BR")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
