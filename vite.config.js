import passes from "./api/passes.js";
import validatePass from "./api/validate-pass.js";
import { loadEnv } from "vite";
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

function localApiPlugin() {
  const handlers = new Map([
    ["/api/passes", passes],
    ["/api/validate-pass", validatePass],
  ]);

  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url || "/", "http://localhost").pathname;
        const handler = handlers.get(pathname);
        if (!handler) {
          next();
          return;
        }

        res.status = (status) => {
          res.statusCode = status;
          return res;
        };
        res.json = (body) => {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(body));
          return res;
        };

        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const rawBody = Buffer.concat(chunks).toString("utf8");
          if (rawBody) {
            try {
              req.body = JSON.parse(rawBody);
            } catch {
              req.body = rawBody;
            }
          }

          await handler(req, res);
        } catch (error) {
          console.error(`Local API error (${pathname})`, error);
          if (!res.headersSent) {
            res.status(500).json({ error: "The local API failed. Check the terminal for details." });
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode, command }) => {
  if (command === "serve") {
    const env = loadEnv(mode, process.cwd(), "");
    if (!process.env.DATABASE_URL && env.DATABASE_URL) process.env.DATABASE_URL = env.DATABASE_URL;
    if (!process.env.POSTGRES_URL && env.POSTGRES_URL) process.env.POSTGRES_URL = env.POSTGRES_URL;
    if (!process.env.CHECKIN_ADMIN_TOKEN && env.CHECKIN_ADMIN_TOKEN) {
      process.env.CHECKIN_ADMIN_TOKEN = env.CHECKIN_ADMIN_TOKEN;
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(command === "serve" ? [localApiPlugin()] : []),
    ],
  };
})
