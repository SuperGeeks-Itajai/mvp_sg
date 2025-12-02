import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao autenticar");
        return;
      }

      // Salva o token localmente
      localStorage.setItem("token", data.token);

      // Garante que o backend enviou o usuário corretamente
      if (!data.usuario || !data.usuario.tipo) {
        setErro("Resposta inválida do servidor");
        return;
      }

      // Redireciona conforme o tipo
      if (data.usuario.tipo === "aluno") {
        navigate("/aluno/dashboard");
      } else if (data.usuario.tipo === "funcionario") {
        navigate("/funcionario/dashboard");
      } else {
        setErro("Tipo de usuário desconhecido");
      }

    } catch (err) {
      console.error("Erro ao conectar:", err);
      setErro("Erro de conexão com o servidor");
    }
  }

  return (
    <div className="login-container">
      <h2 className="text-center login-title">Portal Educacional</h2>
      <p className="text-center mb-4">Entre com suas credenciais</p>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-red w-100">
          Entrar
        </button>
      </form>
    </div>
  );
}
