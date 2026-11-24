/*
  Warnings:

  - You are about to drop the `connections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "connections" DROP CONSTRAINT "connections_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "connections" DROP CONSTRAINT "connections_requesterId_fkey";

-- DropTable
DROP TABLE "connections";

-- CreateTable
CREATE TABLE "userconnections" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userconnections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "userconnections_requesterId_idx" ON "userconnections"("requesterId");

-- CreateIndex
CREATE INDEX "userconnections_receiverId_idx" ON "userconnections"("receiverId");

-- AddForeignKey
ALTER TABLE "userconnections" ADD CONSTRAINT "userconnections_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userconnections" ADD CONSTRAINT "userconnections_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
