const TOKEN_KEY = "auth_token";

// Credenciais fake (pra facilitar o Playwright)
export const DEMO_USER = {
  email: "admin@admin.com",
  password: "admin123",
};

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function login(email, password) {
  const ok = email === DEMO_USER.email && password === DEMO_USER.password;
  if (!ok) return { ok: false, message: "Credenciais inválidas" };

  localStorage.setItem(TOKEN_KEY, "demo-token");
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
