# Backend

API backend em `Node.js + Fastify + Prisma + PostgreSQL`.

## Pré-requisitos

- Node.js 20+
- npm
- Docker e Docker Compose (opcional, mas recomendado para subir o PostgreSQL)

## 1) Instalar dependências

```bash
npm install
```

## 2) Configurar variáveis de ambiente

Crie/edite o arquivo `.env` na raiz do projeto com pelo menos:

```env
DATABASE_URL="postgresql://ApogeuManager:paraoalto@localhost:5432/apogeuDB"
CLERK_SECRET_KEY="sua_chave_do_clerk"
PORT=3333
SWAGGER_SERVER_URL="http://localhost:3333"
```

Observações:
- `DATABASE_URL` é obrigatória para Prisma.
- `CLERK_SECRET_KEY` é obrigatória para `seed` e `unseed`.

## 3) Subir banco de dados local

Com Docker:

```bash
docker compose up -d
```

Isso sobe o Postgres com os dados de `docker-compose.yml`:
- user: `ApogeuManager`
- password: `paraoalto`
- db: `apogeuDB`
- porta: `5432`

## 4) Aplicar migrations

Para ambiente local, você pode usar:

```bash
npx prisma migrate deploy
```

Se estiver desenvolvendo novas migrations:

```bash
npx prisma migrate dev
```

## 5) (Opcional) Popular banco com seed

```bash
npm run seed
```

Para limpar dados seedados:

```bash
npm run unseed
```

Também existem endpoints públicos:
- `POST /seed/run`
- `POST /seed/unseed`

## 6) Rodar o projeto

Modo desenvolvimento:

```bash
npm run dev
```

Build + execução:

```bash
npm run build
npm run start
```

## 7) Acessar documentação

Com a API rodando:
- Swagger UI: `http://localhost:3333/docs`
- OpenAPI JSON: `http://localhost:3333/documentation/json`

## Scripts úteis

- `npm run dev`: sobe API com hot reload
- `npm run build`: gera Prisma Client e compila TypeScript
- `npm run start`: executa build em `dist`
- `npm run test`: roda testes
- `npm run seed`: popula dados
- `npm run unseed`: remove dados seedados
