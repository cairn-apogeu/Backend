-- CreateTable
CREATE TABLE "Usuario" (
    "usu_id" TEXT NOT NULL,
    "Nome" TEXT,
    "Instagram" TEXT,
    "Endereco" TEXT,
    "Bairro" TEXT,
    "Numero" TEXT,
    "Complemento" TEXT,
    "Genero" TEXT,
    "DataNascimento" TIMESTAMP(3),
    "Verificacao" BOOLEAN,
    "Ticket" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usu_id")
);

-- CreateTable
CREATE TABLE "Formulario" (
    "for_id" TEXT NOT NULL,
    "usu_id" TEXT NOT NULL,
    "Status" BOOLEAN NOT NULL,
    "Objetivo" TEXT[],
    "Ocupacao" TEXT[],
    "TamanhoEmpresa" TEXT,
    "Setor" TEXT[],
    "bemConectado" INTEGER NOT NULL,
    "Introversao" INTEGER NOT NULL,
    "OndeJantar" TEXT NOT NULL,
    "Assuntos" TEXT[],
    "RacionalEmocional" TEXT NOT NULL,
    "Hobbies" TEXT[],
    "Religiao" TEXT NOT NULL,
    "Acontecimento" TEXT[],
    "Noturno" INTEGER NOT NULL,
    "ExperienciaGastronomica" TEXT NOT NULL,
    "Culinarias" TEXT[],
    "NovosSabores" INTEGER NOT NULL,
    "Bebidas" TEXT[],
    "RestricaoAlimentar" TEXT[],
    "StatusRelacionamento" TEXT NOT NULL,
    "NecessidadeEspecial" TEXT NOT NULL,
    "OndeConheceu" TEXT NOT NULL,

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("for_id")
);

-- CreateTable
CREATE TABLE "EventoGrupo" (
    "eve_id" TEXT NOT NULL,
    "res_id" TEXT NOT NULL,
    "Quarta" TIMESTAMP(3) NOT NULL,
    "horario" TEXT NOT NULL,

    CONSTRAINT "EventoGrupo_pkey" PRIMARY KEY ("eve_id")
);

-- CreateTable
CREATE TABLE "Acompanhantes" (
    "acompanha_id" TEXT NOT NULL,
    "a_id" TEXT NOT NULL,
    "b_id" TEXT,
    "eve_id" TEXT NOT NULL,

    CONSTRAINT "Acompanhantes_pkey" PRIMARY KEY ("acompanha_id")
);

-- CreateTable
CREATE TABLE "UsuarioEventoGrupo" (
    "usu_id" TEXT NOT NULL,
    "eve_id" TEXT NOT NULL,
    "Confirmado" BOOLEAN,

    CONSTRAINT "UsuarioEventoGrupo_pkey" PRIMARY KEY ("usu_id","eve_id")
);

-- CreateTable
CREATE TABLE "Restaurante" (
    "res_id" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Endereco" TEXT NOT NULL,
    "Latitude" INTEGER,
    "Longitude" INTEGER,

    CONSTRAINT "Restaurante_pkey" PRIMARY KEY ("res_id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "ava_id" SERIAL NOT NULL,
    "usu_id" TEXT NOT NULL,
    "eve_id" TEXT NOT NULL,
    "descricao" TEXT,
    "avaliacaoUsuario" INTEGER,
    "avaliacaoEvento" INTEGER,
    "avaliacaoRestaurante" INTEGER,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("ava_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Instagram_key" ON "Usuario"("Instagram");

-- CreateIndex
CREATE UNIQUE INDEX "Formulario_usu_id_key" ON "Formulario"("usu_id");

-- CreateIndex
CREATE UNIQUE INDEX "Acompanhantes_a_id_b_id_eve_id_key" ON "Acompanhantes"("a_id", "b_id", "eve_id");

-- AddForeignKey
ALTER TABLE "Formulario" ADD CONSTRAINT "Formulario_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuario"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoGrupo" ADD CONSTRAINT "EventoGrupo_res_id_fkey" FOREIGN KEY ("res_id") REFERENCES "Restaurante"("res_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acompanhantes" ADD CONSTRAINT "Acompanhantes_a_id_fkey" FOREIGN KEY ("a_id") REFERENCES "Usuario"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acompanhantes" ADD CONSTRAINT "Acompanhantes_b_id_fkey" FOREIGN KEY ("b_id") REFERENCES "Usuario"("usu_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acompanhantes" ADD CONSTRAINT "Acompanhantes_eve_id_fkey" FOREIGN KEY ("eve_id") REFERENCES "EventoGrupo"("eve_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEventoGrupo" ADD CONSTRAINT "UsuarioEventoGrupo_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuario"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEventoGrupo" ADD CONSTRAINT "UsuarioEventoGrupo_eve_id_fkey" FOREIGN KEY ("eve_id") REFERENCES "EventoGrupo"("eve_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuario"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_eve_id_fkey" FOREIGN KEY ("eve_id") REFERENCES "EventoGrupo"("eve_id") ON DELETE RESTRICT ON UPDATE CASCADE;
