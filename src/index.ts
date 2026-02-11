import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import { clerkClient, clerkPlugin, getAuth } from "@clerk/fastify";

// Importa rotas modulares
import projetoRoutes from "./modules/projetos/projetos.routes";
import cardsRoutes from "./modules/Cards/Cards.routes";
import usersRoutes from "./modules/users/users.routes";
import sprintRoutes from "./modules/Sprints/sprints.routes";
import statisticsRoutes from "./modules/statistics/statistics.routes";
import alunoProjetosRoutes from "./modules/alunoProjetos/alunoProjetos.routes";

const PORT = parseInt(process.env.PORT || "3333", 10);
const SWAGGER_SERVER_URL =
  process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`;

const app = Fastify({ logger: true });
app.register(clerkPlugin);

// Configuração do CORS
app.register(cors, {
  origin: true, // Permite qualquer origem. Substitua por um domínio específico, se necessário.
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
});

// Documentação Swagger / OpenAPI
app.register(swagger, {
  exposeRoute: true,
  routePrefix: "/documentation",
  openapi: {
    info: {
      title: "Apogeu Backend",
      description:
        "Documentação pública da API Apogeu. Todas as rotas exigem autenticação via Clerk (Bearer token).",
      version: "1.0.0",
    },
    servers: [
      {
        url: SWAGGER_SERVER_URL,
        description: "Servidor configurado via SWAGGER_SERVER_URL ou localhost.",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
});

const swaggerUiHtml = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Apogeu API Docs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"
    />
    <style>
      :root {
        color-scheme: dark;
      }
      body {
        margin: 0;
        font-family: "Space Grotesk", system-ui, -apple-system, sans-serif;
        background: radial-gradient(circle at top, #1f2349, #060714);
        min-height: 100vh;
        color: #f1f5f9;
      }
      header {
        text-align: center;
        padding: 40px 20px 0;
      }
      header h1 {
        margin: 0;
        font-size: clamp(32px, 4vw, 48px);
        letter-spacing: -0.5px;
      }
      header p {
        margin-top: 12px;
        color: #cbd5f5;
      }
      #swagger-ui {
        width: min(1200px, 94vw);
        margin: 32px auto 60px;
        background: rgba(6, 7, 20, 0.85);
        padding: 24px 30px;
        border-radius: 28px;
        box-shadow:
          0 35px 70px rgba(2, 6, 23, 0.55),
          inset 0 1px 0 rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(99, 102, 241, 0.2);
      }
      .swagger-ui .topbar {
        display: none;
      }
      .swagger-ui .opblock-summary-method {
        border-radius: 999px;
        font-family: inherit;
        letter-spacing: 0.04em;
      }
      .swagger-ui .opblock {
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.65);
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Apogeu API Reference</h1>
      <p>
        Utilize um token Clerk válido (Bearer) para testar endpoints protegidos.
      </p>
    </header>
    <div id="swagger-ui"></div>

    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        SwaggerUIBundle({
          url: "/documentation/json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          docExpansion: "list",
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset,
          ],
          layout: "BaseLayout",
          tryItOutEnabled: true,
        });
      };
    </script>
  </body>
</html>`;

// Configuração do Clerk

const PUBLIC_DOC_PATHS = [/^\/docs(?:\/|$)/, /^\/documentation(?:\/|$)/];

// Hook global para proteger todas as rotas
app.addHook("preHandler", async (request, reply) => {
  try {
    const isPublicDoc = PUBLIC_DOC_PATHS.some((pattern) =>
      pattern.test(request.url)
    );
    if (isPublicDoc) {
      return;
    }

    // Use `getAuth()` to get the user's ID
    const { userId } = getAuth(request);

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return reply.code(401).send({ error: "User not authenticated" });
    }
    // Adiciona userId ao request para uso nos controllers
    (request as any).userId = userId;
  } catch (error) {
    app.log.error(error);
    return reply.code(500).send({ error: "Failed to retrieve user" });
  }
});

app.get("/docs", async (_request, reply) => {
  reply
    .header("Cache-Control", "no-store")
    .type("text/html")
    .send(swaggerUiHtml);
});

app.get("/documentation/json", async (_request, reply) => {
  reply
    .header("Cache-Control", "no-store")
    .type("application/json")
    .send(app.swagger());
});

// Registro das rotas modulares
app.register(projetoRoutes); // Rotas para projetos
app.register(cardsRoutes); // Rotas para cards
app.register(usersRoutes); // Rotas para usuários
app.register(sprintRoutes); // Rotas para sprints
app.register(statisticsRoutes); // Rotas para estatísticas
app.register(alunoProjetosRoutes); // Rotas para projetos de alunos

// Inicialização do servidor
const start = async () => {
  try {
    app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
