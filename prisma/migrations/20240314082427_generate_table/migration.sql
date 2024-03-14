/*
  Warnings:

  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `textbook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "media";

-- DropTable
DROP TABLE "textbook";

-- CreateTable
CREATE TABLE "product_content" (
    "product_id" INTEGER NOT NULL,
    "content" TEXT,
    "file_url" TEXT,

    CONSTRAINT "product_content_pkey" PRIMARY KEY ("product_id")
);
