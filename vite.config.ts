import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Plugin } from "vite";

// Dev middleware that emulates Vercel serverless functions for /api/* routes
function vercelApiDevPlugin(): Plugin {
  return {
    name: "vercel-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only intercept /api/* POST requests
        if (!req.url?.startsWith("/api/") || req.method !== "POST") {
          return next();
        }

        const route = req.url.replace(/^\/api\//, "").replace(/\?.*$/, "");

        try {
          // Dynamically import the serverless function handler
          const handlerModule = await server.ssrLoadModule(`./api/${route}.ts`);
          const handler = handlerModule.default;

          if (typeof handler !== "function") {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `No handler for /api/${route}` }));
            return;
          }

          // Collect request body
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const bodyStr = Buffer.concat(chunks).toString("utf-8");
          const body = bodyStr ? JSON.parse(bodyStr) : {};

          // Build mock VercelRequest/VercelResponse
          const mockReq = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body,
            query: {},
          };

          const mockRes = {
            _statusCode: 200,
            _headers: {} as Record<string, string>,
            _body: null as any,
            status(code: number) {
              this._statusCode = code;
              return this;
            },
            setHeader(key: string, value: string) {
              this._headers[key] = value;
              return this;
            },
            json(data: any) {
              this._body = data;
              res.statusCode = this._statusCode;
              res.setHeader("Content-Type", "application/json");
              for (const [k, v] of Object.entries(this._headers)) {
                res.setHeader(k, v);
              }
              res.end(JSON.stringify(data));
            },
          };

          await handler(mockReq, mockRes);
        } catch (err: any) {
          console.error(`[vercel-api-dev] Error handling /api/${route}:`, err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables so they're available to serverless function handlers
  const env = loadEnv(mode, process.cwd(), "");
  // Inject non-VITE_ env vars into process.env for the API handlers
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith("VITE_")) {
      process.env[key] = value;
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), vercelApiDevPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      environment: "node",
      include: ["src/**/*.test.{ts,tsx}"],
    },
    esbuild: {
      drop: ["console", "debugger"],
      legalComments: "none",
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
          chunkFileNames: "assets/[hash].js",
          entryFileNames: "assets/[hash].js",
          assetFileNames: "assets/[hash].[ext]",
        },
      },
    },
  };
});
