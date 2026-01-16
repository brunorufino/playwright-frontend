import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAuthenticated } from "../auth";

export default function Login() {
  const navigate = useNavigate();
  const alreadyLogged = useMemo(() => isAuthenticated(), []);
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  if (alreadyLogged) {
    // se já estiver logado, manda pra home
    setTimeout(() => navigate("/"), 0);
  }

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    const result = login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 16 }}>
      <h1>Login</h1>

      <form onSubmit={onSubmit}>
        <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
          <label>
            Email
            <input
              data-testid="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 6 }}
              placeholder="admin@admin.com"
              required
            />
          </label>

          <label>
            Senha
            <input
              data-testid="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 6 }}
              placeholder="admin123"
              required
            />
          </label>

          {error && (
            <div data-testid="error" style={{ color: "crimson" }}>
              {error}
            </div>
          )}

          <button
            data-testid="login-button"
            type="submit"
            style={{ padding: 10, cursor: "pointer" }}
          >
            Entrar
          </button>
        </div>
      </form>

      <p style={{ marginTop: 16, opacity: 0.8 }}>
        Demo: <b>admin@admin.com</b> / <b>admin123</b>
      </p>
    </div>
  );
}
