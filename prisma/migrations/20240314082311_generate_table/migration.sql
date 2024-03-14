-- AlterTable
ALTER TABLE "product" ADD COLUMN     "relation_id" INTEGER;

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "file_url" TEXT,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "textbook" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "file_url" TEXT,

    CONSTRAINT "textbook_pkey" PRIMARY KEY ("id")
);
