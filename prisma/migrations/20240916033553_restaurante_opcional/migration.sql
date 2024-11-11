-- DropForeignKey
ALTER TABLE "EventoGrupo" DROP CONSTRAINT "EventoGrupo_res_id_fkey";

-- AlterTable
ALTER TABLE "EventoGrupo" ALTER COLUMN "res_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EventoGrupo" ADD CONSTRAINT "EventoGrupo_res_id_fkey" FOREIGN KEY ("res_id") REFERENCES "Restaurante"("res_id") ON DELETE SET NULL ON UPDATE CASCADE;
