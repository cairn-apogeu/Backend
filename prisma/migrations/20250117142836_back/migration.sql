-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "data_criacao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dod" TEXT,
ADD COLUMN     "dor" TEXT,
ADD COLUMN     "indicacao_conteudo" TEXT,
ADD COLUMN     "xp_arquitetura" INTEGER,
ADD COLUMN     "xp_backend" INTEGER,
ADD COLUMN     "xp_datalytics" INTEGER,
ADD COLUMN     "xp_design" INTEGER,
ADD COLUMN     "xp_frontend" INTEGER,
ADD COLUMN     "xp_negocios" INTEGER;
