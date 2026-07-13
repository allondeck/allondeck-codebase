import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function getSupabaseOrigin(mode: string): string | null {
  const env = loadEnv(mode, process.cwd(), "");
  const url = env.VITE_SUPABASE_URL;
  if (!url || typeof url !== "string") return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export default defineConfig(({ mode }) => {
  const supabaseOrigin = getSupabaseOrigin(mode);
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "html-preconnect",
        transformIndexHtml(html) {
          if (!supabaseOrigin) return html;
          const preconnect = `<link rel="preconnect" href="${supabaseOrigin}" crossorigin="">`;
          return html.replace("</head>", `    ${preconnect}\n  </head>`);
        },
      },
      // ── Dev API handler ──────────────────────────────────────────────────
      // Intercepts POST /api/chat during development so `npm run dev` works
      // without needing `vercel dev`. Uses server.ssrLoadModule() — the correct
      // Vite API for loading TypeScript files server-side (bare import() skips
      // Vite's TypeScript transformer and will 500).
      {
        name: "dev-api",
        apply: "serve",
        configureServer(server) {
          // Inject all .env vars (including non-VITE_ ones) into process.env
          // so api/chat.ts can read GOOGLE_GENERATIVE_AI_API_KEY, SUPABASE_URL, etc.
          for (const [k, v] of Object.entries(env)) {
            if (process.env[k] === undefined) process.env[k] = v;
          }

          server.middlewares.use(async (req, res, next) => {
            if (req.url !== "/api/chat" || req.method !== "POST") {
              return next();
            }

            try {
              // Collect the raw body from the incoming Node request
              const chunks: Buffer[] = [];
              await new Promise<void>((resolve, reject) => {
                req.on("data", (c: Buffer) => chunks.push(c));
                req.on("end", resolve);
                req.on("error", reject);
              });
              const rawBody = Buffer.concat(chunks).toString("utf8");

              // Build a Web API Request the handler expects
              const headers = new Headers();
              for (const [k, v] of Object.entries(req.headers)) {
                if (typeof v === "string") headers.set(k, v);
                else if (Array.isArray(v))
                  v.forEach((val) => headers.append(k, val));
              }
              const webReq = new Request(`http://localhost${req.url}`, {
                method: req.method,
                headers,
                body: rawBody,
              });

              // ssrLoadModule goes through Vite's TypeScript transformer —
              // unlike bare import() which would try to execute raw .ts directly
              const mod = await server.ssrLoadModule("/api/chat.ts");
              const handler = (mod.default ?? mod) as (
                r: Request,
              ) => Promise<Response>;
              const webRes = await handler(webReq);

              // Forward status + headers to Node response
              res.statusCode = webRes.status;
              webRes.headers.forEach((v, k) => res.setHeader(k, v));

              // Stream the body
              if (webRes.body) {
                const reader = webRes.body.getReader();
                for (;;) {
                  const { done, value } = await reader.read();
                  if (done) {
                    res.end();
                    break;
                  }
                  res.write(value);
                }
              } else {
                res.end();
              }
            } catch (err) {
              console.error("[dev-api] /api/chat error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        },
      },
    ],
    build: {
      minify: "esbuild",
      cssMinify: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Only split out heavy libs that don't create circular deps with React.
          // Splitting React into a separate chunk caused "Cannot read properties of undefined (reading 'useState')".
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("recharts")) return "vendor-recharts";
              if (id.includes("@supabase")) return "vendor-supabase";
            }
          },
        },
      },
    },
  };
});
