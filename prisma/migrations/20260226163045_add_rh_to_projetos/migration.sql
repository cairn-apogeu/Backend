-- Add RH reference to projetos
ALTER TABLE "Projetos"
ADD COLUMN     "id_rh" TEXT;

CREATE INDEX IF NOT EXISTS "fk_projetos_id_rh" ON "Projetos"("id_rh");

ALTER TABLE "Projetos"
ADD CONSTRAINT "Projetos_id_rh_fkey" FOREIGN KEY ("id_rh") REFERENCES "Users"("user_clerk_id") ON DELETE SET NULL ON UPDATE CASCADE;
