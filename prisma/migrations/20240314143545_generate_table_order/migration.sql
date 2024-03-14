-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "transaction_id" TEXT,
    "status" VARCHAR,
    "gross_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_detail" (
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" VARCHAR,
    "quantity" INTEGER,
    "price" DOUBLE PRECISION,
    "sub_total" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "order_detail_pkey" PRIMARY KEY ("order_id","product_id")
);

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
