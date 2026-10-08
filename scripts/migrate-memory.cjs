// Additive, idempotent startup migration. Existing restaurant data is preserved.
const { PrismaClient }=require('@prisma/client');
const db=new PrismaClient();
const statements=[
  `ALTER TYPE "AiFeature" ADD VALUE IF NOT EXISTS 'DOCUMENT_READING'`,
  `ALTER TYPE "AiFeature" ADD VALUE IF NOT EXISTS 'COPILOT'`,
  `ALTER TABLE "ai_usages" ADD COLUMN IF NOT EXISTS "requestId" TEXT`,
  `ALTER TABLE "ai_usages" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'completed'`,
  `ALTER TABLE "ai_usages" ADD COLUMN IF NOT EXISTS "purchasedTokens" INTEGER NOT NULL DEFAULT 0`,
  `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='purchasedTokenBalance') THEN ALTER TABLE "users" ADD COLUMN "purchasedTokenBalance" INTEGER NOT NULL DEFAULT 0; UPDATE "users" u SET "purchasedTokenBalance" = GREATEST(0, LEAST(u."tokenBalance", COALESCE((SELECT SUM(o.amount) FROM token_orders o WHERE o."userId"=u.id),0))); END IF; END $$`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ai_usages_requestId_key" ON "ai_usages"("requestId")`,
  `ALTER TABLE "users" ALTER COLUMN "tokenBalance" SET DEFAULT 0`,
  `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "creditPeriodEnd" TIMESTAMP(3)`,
  `CREATE TABLE IF NOT EXISTS "restaurant_workspaces" ("id" TEXT PRIMARY KEY,"restaurantId" TEXT NOT NULL REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE,"data" JSONB NOT NULL,"revision" INTEGER NOT NULL DEFAULT 0,"updatedAt" TIMESTAMP(3) NOT NULL)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "restaurant_workspaces_restaurantId_key" ON "restaurant_workspaces"("restaurantId")`,
  `CREATE TABLE IF NOT EXISTS "restaurant_memory_items" ("id" TEXT PRIMARY KEY,"restaurantId" TEXT NOT NULL REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE,"kind" TEXT NOT NULL,"title" TEXT NOT NULL,"status" TEXT NOT NULL DEFAULT 'draft',"payload" JSONB NOT NULL,"originalName" TEXT,"fileMime" TEXT,"fileData" BYTEA,"fingerprint" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "restaurant_memory_items_restaurantId_fingerprint_key" ON "restaurant_memory_items"("restaurantId","fingerprint")`,
  `ALTER TABLE "restaurant_memory_items" ADD COLUMN IF NOT EXISTS "history" JSONB NOT NULL DEFAULT '[]'`,
  `CREATE INDEX IF NOT EXISTS "restaurant_memory_items_restaurantId_status_createdAt_idx" ON "restaurant_memory_items"("restaurantId","status","createdAt")`,
];
(async()=>{try{for(const statement of statements)await db.$executeRawUnsafe(statement);console.log('Restaurant memory schema ready.');}finally{await db.$disconnect();}})().catch(()=>{console.error('Restaurant memory migration failed; startup stopped.');process.exitCode=1;});
