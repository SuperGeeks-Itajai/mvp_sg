import { useEffect, useState } from "react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: "aluno" | "funcionario";
};

export default function DashboardFuncionario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const token = localStorage.getItem("token");

  async function fetchUser() {
    try {
      const response = await fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Erro ao buscar usuário:", await response.text());
        return;
      }

      const data = await response.json();
      setUsuario(data.usuario); // <-- CORREÇÃO!
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  }

  useEffect(() => {
    const carregar = async () => {
      await fetchUser();
    };

    carregar();
  }, []);

  return (
    <div className="container-fluid bg-light min-vh-100 p-0">
      {/* Top navbar */}
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand mb-0 h1 text-white">
          Painel do Funcionário
        </span>
      </nav>

      <div className="row g-0">
        {/* Menu lateral */}
        <div className="col-12 col-md-3 col-lg-2 bg-black text-white p-3">
          <h5 className="text-center mb-4">Menu</h5>
          <ul className="list-group">
            <li className="list-group-item bg-black text-white border-secondary">
              Gerenciar Alunos
            </li>
            <li className="list-group-item bg-black text-white border-secondary">
              Gerenciar Funcionários
            </li>
            <li className="list-group-item bg-black text-white border-secondary">
              Módulos e Aulas
            </li>
            <li className="list-group-item bg-black text-white border-secondary">
              Histórico
            </li>
          </ul>
        </div>

        {/* Conteúdo principal */}
        <div className="col-12 col-md-9 col-lg-10 p-4">
          <h2 className="fw-bold" style={{ color: "#b30000" }}>
            Bem-vindo, {usuario?.nome || "Carregando..."}!
          </h2>

          <p className="mt-3">
            Aqui você pode gerenciar alunos, funcionários, aulas, módulos e
            acompanhar relatórios.
          </p>

          <div className="mt-4 p-3 bg-white rounded shadow-sm">
            <h4 style={{ color: "#b30000" }}>Visão Geral</h4>
            <p>
              Sistema educacional interno com controle completo de usuários e
              módulos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
