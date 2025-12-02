import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import DashboardAluno from "../pages/DashboardAluno";
import DashboardFuncionario from "../pages/DashboardFuncionario";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: "aluno/dashboard", element: <DashboardAluno /> },
      { path: "funcionario/dashboard", element: <DashboardFuncionario /> }
    ],
  },
]);
