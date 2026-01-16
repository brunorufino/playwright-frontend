import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Healthcheck (Railway)
app.get("/health", (req, res) => res.status(200).send("ok"));

// Serve os arquivos estáticos do Vite build (dist)
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback (Express 5: wildcard precisa ter nome)
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Porta (Railway injeta PORT)
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
