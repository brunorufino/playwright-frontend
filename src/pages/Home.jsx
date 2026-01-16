import { useNavigate } from "react-router-dom";
import { logout } from "../auth";

export default function Home() {
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 720, margin: "60px auto", padding: 16 }}>
      <h1 data-testid="home-title">Home</h1>
      <p>Você está logado ✅</p>

      <button
        data-testid="logout-button"
        onClick={onLogout}
        style={{ padding: 10, cursor: "pointer" }}
      >
        Sair
      </button>
    </div>
  );
}
