ALTER TABLE "game" 
  ADD COLUMN "status" TEXT DEFAULT 'waiting for players',
  DROP COLUMN "canvas";