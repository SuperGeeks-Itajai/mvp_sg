import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: "aluno" | "funcionario";
};

export default function DashboardFuncionario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const text = await response.text();

        if (!response.ok) {
          console.error("Erro ao buscar usuário:", text);
          return;
        }

        const data = JSON.parse(text);

        // ✅ Ajuste fundamental
        setUsuario(data.usuario);

      } catch (error) {
        console.error("Erro de conexão:", error);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="container-fluid bg-light min-vh-100 p-0">
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand mb-0 h1 text-white">
          Painel do Funcionário
        </span>
      </nav>

      <div className="row g-0">

        <div className="col-12 col-md-3 col-lg-2 bg-black text-white p-3">
          <h5 className="text-center mb-4">Menu</h5>
          <ul className="list-group">

            <Link
              to="/funcionario/gerenciar-alunos"
              className="list-group-item bg-black text-white border-secondary"
            >
              Gerenciar Alunos
            </Link>

            <Link
              to="/funcionario/gerenciar-funcionarios"
              className="list-group-item bg-black text-white border-secondary"
            >
              Gerenciar Funcionários
            </Link>

            <Link
            to="/funcionario/gerenciar-modulos"
            className="list-group-item bg-black text-white border-secondary"
            >
              Módulos e Aulas
            </Link>

            <li className="list-group-item bg-black text-white border-secondary">
              Histórico
            </li>

          </ul>
        </div>

        <div className="col-12 col-md-9 col-lg-10 p-4">
          <h2 className="fw-bold" style={{ color: "#b30000" }}>
            Bem-vindo, {usuario?.nome || "Carregando..."}!
          </h2>

          <p className="mt-3">
            Aqui você pode gerenciar alunos, funcionários, aulas, módulos e acompanhar relatórios.
          </p>

          <div className="mt-4 p-3 bg-white rounded shadow-sm">
            <h4 style={{ color: "#b30000" }}>Visão Geral</h4>
            <p>Sistema educacional interno com controle completo de usuários e módulos.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
