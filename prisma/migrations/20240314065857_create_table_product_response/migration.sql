/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "type" "ProductType" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_response" (
    "product_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "enroll_at" TIMESTAMPTZ(3),
    "is_enroll" BOOLEAN,

    CONSTRAINT "product_response_pkey" PRIMARY KEY ("product_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_name_key" ON "product"("name");
