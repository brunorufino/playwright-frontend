import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAuthenticated, DEMO_USER } from "../auth";

export default function Login() {
  const navigate = useNavigate();
  const alreadyLogged = useMemo(() => isAuthenticated(), []);
  const [email, setEmail] = useState(DEMO_USER.email);
  const [password, setPassword] = useState(DEMO_USER.password);
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  if (alreadyLogged) setTimeout(() => navigate("/"), 0);

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    const result = login(email, password);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    // “Remember me” aqui é só visual (o token já fica no localStorage),
    // mas deixa um gancho legal pra automação depois.
    if (remember) localStorage.setItem("remember_me", "1");
    else localStorage.removeItem("remember_me");

    navigate("/");
  }

  return (
    <div className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ width: "min(520px, 100%)" }}>
        <div className="cardHeader">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <div className="row" style={{ gap: 10 }}>
                <span className="logoDot" />
                <div>
                  <div style={{ fontWeight: 800, letterSpacing: "-0.2px" }}>Stygma Automation</div>
                  <div className="muted" style={{ fontSize: 12 }}>Painel de testes & automações</div>
                </div>
              </div>
            </div>
            <span className="badge" data-testid="login-badge">Playwright-ready</span>
          </div>
        </div>

        <div className="cardBody">
          <h1 className="h1" style={{ marginBottom: 6 }}>Entrar</h1>
          <p className="p">Use o usuário demo pra testar os fluxos no Playwright.</p>

          <form onSubmit={onSubmit} style={{ marginTop: 10 }}>
            <label className="label">Email</label>
            <input
              className="input"
              data-testid="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@admin.com"
              required
            />

            <label className="label">Senha</label>
            <div className="row">
              <input
                className="input"
                data-testid="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
              />
              <button
                type="button"
                className="btn btnGhost"
                data-testid="toggle-password"
                onClick={() => setShowPass((s) => !s)}
                style={{ whiteSpace: "nowrap" }}
              >
                {showPass ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
              <label className="row muted" style={{ gap: 8, cursor: "pointer" }}>
                <input
                  data-testid="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Lembrar de mim
              </label>
              <span className="kbd" title="Somente visual">Ctrl + Enter</span>
            </div>

            {error && (
              <div className="error" data-testid="error" style={{ marginTop: 10 }}>
                {error}
              </div>
            )}

            <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
              <span className="muted" style={{ fontSize: 12 }}>
                Demo: <b>{DEMO_USER.email}</b> / <b>{DEMO_USER.password}</b>
              </span>
              <button
                data-testid="login-button"
                className="btn btnPrimary"
                type="submit"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
