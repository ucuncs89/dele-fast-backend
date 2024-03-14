/*
  Warnings:

  - You are about to drop the `product_content` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "product_content";

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "file_url" TEXT,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "textbooks" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "file_url" TEXT,

    CONSTRAINT "textbooks_pkey" PRIMARY KEY ("id")
);
