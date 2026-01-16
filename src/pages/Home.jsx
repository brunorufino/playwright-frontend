import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth";

const STORAGE_KEY = "automations_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function loadAutomations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAutomations(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function statusBadge(status) {
  if (status === "PASSED") return <span className="badge"><span className="ok">●</span> Passed</span>;
  if (status === "FAILED") return <span className="badge"><span className="error">●</span> Failed</span>;
  return <span className="badge"><span className="muted">●</span> Running</span>;
}

export default function Home() {
  const navigate = useNavigate();

  // menu interno (ótimo pra testes E2E)
  const [section, setSection] = useState("dashboard"); // dashboard | automations | runs | settings
  const [automations, setAutomations] = useState(() => loadAutomations());

  const [newName, setNewName] = useState("Smoke tests - nightly");
  const [newSchedule, setNewSchedule] = useState("daily_09");
  const [newEnv, setNewEnv] = useState("staging");
  const [newEnabled, setNewEnabled] = useState(true);

  useEffect(() => saveAutomations(automations), [automations]);

  const runs = useMemo(() => {
    // dados fake (perfeito pra validar UI / seletores)
    return [
      { id: "r1", name: "Login - happy path", env: "staging", status: "PASSED", at: "há 3 min" },
      { id: "r2", name: "Checkout - regression", env: "prod", status: "FAILED", at: "há 1h" },
      { id: "r3", name: "API health", env: "staging", status: "PASSED", at: "ontem" },
    ];
  }, []);

  const stats = useMemo(() => {
    const total = runs.length;
    const passed = runs.filter(r => r.status === "PASSED").length;
    const failed = runs.filter(r => r.status === "FAILED").length;
    return { total, passed, failed };
  }, [runs]);

  function onLogout() {
    logout();
    navigate("/login");
  }

  function addAutomation() {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const item = {
      id: uid(),
      name: trimmed,
      schedule: newSchedule,
      env: newEnv,
      enabled: newEnabled,
      createdAt: new Date().toISOString(),
    };

    setAutomations((prev) => [item, ...prev]);
  }

  function toggleAutomation(id) {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }

  function deleteAutomation(id) {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="card sidebar">
        <div className="brand">
          <span className="logoDot" />
          <div>
            <div className="brandTitle">Stygma Automation</div>
            <div className="brandSub">Dashboard de testes</div>
          </div>
        </div>

        <div
          className={`navItem ${section === "dashboard" ? "navItemActive" : ""}`}
          data-testid="menu-dashboard"
          onClick={() => setSection("dashboard")}
        >
          <span>📊 Dashboard</span>
          <span className="kbd">D</span>
        </div>

        <div
          className={`navItem ${section === "automations" ? "navItemActive" : ""}`}
          data-testid="menu-automations"
          onClick={() => setSection("automations")}
        >
          <span>⚙️ Automações</span>
          <span className="kbd">A</span>
        </div>

        <div
          className={`navItem ${section === "runs" ? "navItemActive" : ""}`}
          data-testid="menu-runs"
          onClick={() => setSection("runs")}
        >
          <span>🧪 Execuções</span>
          <span className="kbd">R</span>
        </div>

        <div
          className={`navItem ${section === "settings" ? "navItemActive" : ""}`}
          data-testid="menu-settings"
          onClick={() => setSection("settings")}
        >
          <span>🔧 Config</span>
          <span className="kbd">S</span>
        </div>

        <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
          <button className="btn btnDanger" data-testid="logout-button" onClick={onLogout} style={{ width: "100%" }}>
            Sair
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="card">
        <div className="topbar">
          <div>
            <div className="h2" data-testid="home-title">
              {section === "dashboard" && "Dashboard"}
              {section === "automations" && "Automações"}
              {section === "runs" && "Execuções"}
              {section === "settings" && "Configurações"}
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Interface com seletores estáveis para Playwright (data-testid).
            </div>
          </div>

          <div className="row">
            <span className="badge" data-testid="env-badge">ENV: staging</span>
            <button
              className="btn btnPrimary"
              data-testid="quick-run"
              onClick={() => setSection("runs")}
              title="Ir para execuções"
            >
              Rodar smoke
            </button>
          </div>
        </div>

        <div className="cardBody">
          {section === "dashboard" && (
            <>
              <div className="card" style={{ padding: 16, marginBottom: 12 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <h1 className="h1">Automação de testes, do jeito certo</h1>
                    <p className="p">
                      Crie automações, acompanhe execuções e use o Playwright pra validar todo o fluxo.
                    </p>
                  </div>
                  <div className="badge" data-testid="hero-badge">Vite + Express + Railway</div>
                </div>
              </div>

              <div className="grid3" style={{ marginBottom: 12 }}>
                <div className="card">
                  <div className="cardHeader"><div className="h2">Execuções</div></div>
                  <div className="cardBody">
                    <div style={{ fontSize: 28, fontWeight: 800 }} data-testid="stat-total">{stats.total}</div>
                    <div className="muted">Total (últimas)</div>
                  </div>
                </div>

                <div className="card">
                  <div className="cardHeader"><div className="h2">Passed</div></div>
                  <div className="cardBody">
                    <div style={{ fontSize: 28, fontWeight: 800 }} className="ok" data-testid="stat-passed">{stats.passed}</div>
                    <div className="muted">Sucesso</div>
                  </div>
                </div>

                <div className="card">
                  <div className="cardHeader"><div className="h2">Failed</div></div>
                  <div className="cardBody">
                    <div style={{ fontSize: 28, fontWeight: 800 }} className="error" data-testid="stat-failed">{stats.failed}</div>
                    <div className="muted">Falhas</div>
                  </div>
                </div>
              </div>

              <div className="grid2">
                <div className="card">
                  <div className="cardHeader">
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <div className="h2">Automações (rápido)</div>
                      <button className="btn" data-testid="go-automations" onClick={() => setSection("automations")}>
                        Abrir
                      </button>
                    </div>
                  </div>
                  <div className="cardBody">
                    <p className="muted" style={{ marginTop: 0 }}>
                      Cadastre uma automação de exemplo (salva no localStorage).
                    </p>

                    <label className="label">Nome</label>
                    <input
                      className="input"
                      data-testid="automation-name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ex: Smoke tests - nightly"
                    />

                    <div className="grid2" style={{ marginTop: 10 }}>
                      <div>
                        <label className="label">Agendamento</label>
                        <select
                          className="input"
                          data-testid="automation-schedule"
                          value={newSchedule}
                          onChange={(e) => setNewSchedule(e.target.value)}
                        >
                          <option value="daily_09">Diário - 09:00</option>
                          <option value="hourly">A cada 1 hora</option>
                          <option value="weekdays_19">Seg-Sex - 19:00</option>
                          <option value="manual">Manual</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Ambiente</label>
                        <select
                          className="input"
                          data-testid="automation-env"
                          value={newEnv}
                          onChange={(e) => setNewEnv(e.target.value)}
                        >
                          <option value="staging">staging</option>
                          <option value="prod">prod</option>
                          <option value="dev">dev</option>
                        </select>
                      </div>
                    </div>

                    <div className="row" style={{ justifyContent: "space-between", marginTop: 10 }}>
                      <label className="row muted" style={{ gap: 8, cursor: "pointer" }}>
                        <input
                          data-testid="automation-enabled"
                          type="checkbox"
                          checked={newEnabled}
                          onChange={(e) => setNewEnabled(e.target.checked)}
                        />
                        Ativa
                      </label>
                      <button className="btn btnPrimary" data-testid="automation-add" onClick={addAutomation}>
                        Criar automação
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="cardHeader">
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <div className="h2">Últimas execuções</div>
                      <button className="btn" data-testid="go-runs" onClick={() => setSection("runs")}>
                        Ver tudo
                      </button>
                    </div>
                  </div>
                  <div className="cardBody">
                    <table className="table" data-testid="runs-table">
                      <thead>
                        <tr>
                          <th>Teste</th>
                          <th>Env</th>
                          <th>Status</th>
                          <th>Quando</th>
                        </tr>
                      </thead>
                      <tbody>
                        {runs.map((r) => (
                          <tr key={r.id} data-testid={`run-row-${r.id}`}>
                            <td>{r.name}</td>
                            <td>{r.env}</td>
                            <td>{statusBadge(r.status)}</td>
                            <td>{r.at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {section === "automations" && (
            <div className="card">
              <div className="cardHeader">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="h2">Gerenciar automações</div>
                  <span className="badge" data-testid="automations-count">
                    {automations.length} item(ns)
                  </span>
                </div>
              </div>

              <div className="cardBody">
                {automations.length === 0 ? (
                  <p className="muted" data-testid="automations-empty">
                    Nenhuma automação cadastrada ainda. Crie uma no Dashboard.
                  </p>
                ) : (
                  <table className="table" data-testid="automations-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Schedule</th>
                        <th>Env</th>
                        <th>Ativa</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {automations.map((a) => (
                        <tr key={a.id} data-testid={`automation-row-${a.id}`}>
                          <td style={{ color: "rgba(255,255,255,0.86)" }}>{a.name}</td>
                          <td>{a.schedule}</td>
                          <td>{a.env}</td>
                          <td>
                            <button
                              className="btn"
                              data-testid={`automation-toggle-${a.id}`}
                              onClick={() => toggleAutomation(a.id)}
                            >
                              {a.enabled ? "Ligada" : "Desligada"}
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btnDanger"
                              data-testid={`automation-delete-${a.id}`}
                              onClick={() => deleteAutomation(a.id)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
                  Dica Playwright: você consegue criar, ligar/desligar e remover automações só usando os <code>data-testid</code>.
                </div>
              </div>
            </div>
          )}

          {section === "runs" && (
            <div className="card">
              <div className="cardHeader">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="h2">Execuções</div>
                  <span className="badge">Últimas 3</span>
                </div>
              </div>
              <div className="cardBody">
                <p className="muted" style={{ marginTop: 0 }}>
                  Aqui você poderia plugar futuramente um endpoint /api/runs. Por enquanto é mock.
                </p>

                <table className="table" data-testid="runs-table-full">
                  <thead>
                    <tr>
                      <th>Teste</th>
                      <th>Env</th>
                      <th>Status</th>
                      <th>Quando</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((r) => (
                      <tr key={r.id}>
                        <td>{r.name}</td>
                        <td>{r.env}</td>
                        <td>{statusBadge(r.status)}</td>
                        <td>{r.at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="row" style={{ marginTop: 12, justifyContent: "flex-end" }}>
                  <button className="btn" data-testid="runs-refresh" onClick={() => navigate(0)}>
                    Atualizar
                  </button>
                </div>
              </div>
            </div>
          )}

          {section === "settings" && (
            <div className="grid2">
              <div className="card">
                <div className="cardHeader"><div className="h2">Configurações</div></div>
                <div className="cardBody">
                  <p className="muted" style={{ marginTop: 0 }}>
                    Essa seção é ótima pra testes E2E (toggles, selects, persistência).
                  </p>

                  <label className="label">Ambiente padrão</label>
                  <select className="input" data-testid="settings-default-env" defaultValue="staging">
                    <option value="staging">staging</option>
                    <option value="prod">prod</option>
                    <option value="dev">dev</option>
                  </select>

                  <label className="label">Notificações</label>
                  <label className="row muted" style={{ gap: 8, cursor: "pointer" }}>
                    <input data-testid="settings-notify" type="checkbox" defaultChecked />
                    Avisar falhas por email (mock)
                  </label>

                  <div className="row" style={{ marginTop: 12 }}>
                    <button className="btn btnPrimary" data-testid="settings-save">
                      Salvar
                    </button>
                    <button
                      className="btn"
                      data-testid="settings-reset-automations"
                      onClick={() => setAutomations([])}
                      title="Limpa as automações"
                    >
                      Limpar automações
                    </button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardHeader"><div className="h2">Sobre</div></div>
                <div className="cardBody">
                  <p className="muted" style={{ marginTop: 0 }}>
                    Próximos passos pra virar “automação de verdade”:
                  </p>
                  <ul className="muted" style={{ lineHeight: 1.7 }}>
                    <li>Adicionar um backend /api (runs, schedules, usuários)</li>
                    <li>Executar Playwright no CI e publicar relatórios</li>
                    <li>Criar um job scheduler (cron/queue) pra disparar testes</li>
                  </ul>
                  <div className="badge" data-testid="about-badge">Version: UI Mock v1</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
