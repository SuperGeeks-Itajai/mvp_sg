import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import DashboardAluno from "../pages/DashboardAluno";
import DashboardFuncionario from "../pages/DashboardFuncionario";
import GerenciarAlunos from "../pages/GerenciarAlunos";
import GerenciarFuncionarios from "../pages/GerenciarFuncionarios";
import GerenciarModulos from "../pages/GerenciarModulos";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },

      { path: "aluno/dashboard", element: <DashboardAluno /> },

      { path: "funcionario/dashboard", element: <DashboardFuncionario /> },

      { path: "funcionario/gerenciar-alunos", element: <GerenciarAlunos /> },
      
      { path: "funcionario/gerenciar-funcionarios", element: <GerenciarFuncionarios /> },

      { path: "funcionario/gerenciar-modulos", element: <GerenciarModulos /> }

    ],
  },
]);
