-- CreateTable
CREATE TABLE "Users" (
    "user_clerk_id" TEXT NOT NULL,
    "tipo_perfil" VARCHAR(10) NOT NULL,
    "discord" VARCHAR(20),
    "linkedin" VARCHAR(30),
    "github" VARCHAR(30),
    "objetivo_curto" TEXT,
    "objetivo_medio" TEXT,
    "objetivo_longo" TEXT,
    "genero" VARCHAR(10),
    "nascimento" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_clerk_id")
);

-- CreateTable
CREATE TABLE "Projetos" (
    "id" SERIAL NOT NULL,
    "id_cliente" TEXT NOT NULL,
    "id_gestor" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "valor" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "token" VARCHAR(512),
    "repositorio" VARCHAR(100),
    "owner" VARCHAR(100),
    "dia_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dia_fim" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sprints" (
    "id" SERIAL NOT NULL,
    "id_projeto" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "dia_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dia_fim" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlunosProjetos" (
    "projeto_id" INTEGER NOT NULL,
    "aluno_id" TEXT NOT NULL,

    CONSTRAINT "AlunosProjetos_pkey" PRIMARY KEY ("projeto_id","aluno_id")
);

-- CreateTable
CREATE TABLE "Cards" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "status" VARCHAR(20) NOT NULL,
    "tempo_estimado" INTEGER,
    "tempo" INTEGER,
    "assigned" TEXT,
    "sprint" INTEGER,
    "projeto" INTEGER,
    "dod" TEXT,
    "dor" TEXT,
    "xp_frontend" INTEGER,
    "xp_backend" INTEGER,
    "xp_negocios" INTEGER,
    "xp_arquitetura" INTEGER,
    "xp_design" INTEGER,
    "xp_datalytics" INTEGER,
    "indicacao_conteudo" TEXT,
    "data_criacao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fk_projetos_id_cliente" ON "Projetos"("id_cliente");

-- CreateIndex
CREATE INDEX "fk_projetos_id_gestor" ON "Projetos"("id_gestor");

-- CreateIndex
CREATE INDEX "fk_sprints_id_projeto" ON "Sprints"("id_projeto");

-- CreateIndex
CREATE INDEX "fk_alunos_projeto_id" ON "AlunosProjetos"("projeto_id");

-- CreateIndex
CREATE INDEX "fk_alunos_aluno_id" ON "AlunosProjetos"("aluno_id");

-- CreateIndex
CREATE INDEX "fk_cards_assigned" ON "Cards"("assigned");

-- CreateIndex
CREATE INDEX "fk_cards_sprint" ON "Cards"("sprint");

-- CreateIndex
CREATE INDEX "fk_cards_projeto" ON "Cards"("projeto");

-- AddForeignKey
ALTER TABLE "Projetos" ADD CONSTRAINT "Projetos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projetos" ADD CONSTRAINT "Projetos_id_gestor_fkey" FOREIGN KEY ("id_gestor") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprints" ADD CONSTRAINT "Sprints_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlunosProjetos" ADD CONSTRAINT "AlunosProjetos_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "Projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlunosProjetos" ADD CONSTRAINT "AlunosProjetos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "Users"("user_clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_assigned_fkey" FOREIGN KEY ("assigned") REFERENCES "Users"("user_clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_sprint_fkey" FOREIGN KEY ("sprint") REFERENCES "Sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_projeto_fkey" FOREIGN KEY ("projeto") REFERENCES "Projetos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
