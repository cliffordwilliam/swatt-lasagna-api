-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "pembeliId" TEXT NOT NULL,
    "penerimaId" TEXT NOT NULL,
    "tanggalOrder" TIMESTAMP(3) NOT NULL,
    "tanggalKirim" TIMESTAMP(3) NOT NULL,
    "totalPembelian" DOUBLE PRECISION NOT NULL,
    "pickupDeliveryId" TEXT NOT NULL,
    "ongkir" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "pembayaranId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdersOnItems" (
    "quantity" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "OrdersOnItems_pkey" PRIMARY KEY ("orderId","itemId")
);

-- CreateTable
CREATE TABLE "Pembeli" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,

    CONSTRAINT "Pembeli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penerima" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,

    CONSTRAINT "Penerima_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupDelivery" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PickupDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Item_nama_key" ON "Item"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Pembeli_nama_key" ON "Pembeli"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Pembeli_alamat_key" ON "Pembeli"("alamat");

-- CreateIndex
CREATE UNIQUE INDEX "Pembeli_noHp_key" ON "Pembeli"("noHp");

-- CreateIndex
CREATE UNIQUE INDEX "Penerima_nama_key" ON "Penerima"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Penerima_alamat_key" ON "Penerima"("alamat");

-- CreateIndex
CREATE UNIQUE INDEX "Penerima_noHp_key" ON "Penerima"("noHp");

-- CreateIndex
CREATE UNIQUE INDEX "Pembayaran_name_key" ON "Pembayaran"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PickupDelivery_name_key" ON "PickupDelivery"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pembeliId_fkey" FOREIGN KEY ("pembeliId") REFERENCES "Pembeli"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_penerimaId_fkey" FOREIGN KEY ("penerimaId") REFERENCES "Penerima"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickupDeliveryId_fkey" FOREIGN KEY ("pickupDeliveryId") REFERENCES "PickupDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pembayaranId_fkey" FOREIGN KEY ("pembayaranId") REFERENCES "Pembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersOnItems" ADD CONSTRAINT "OrdersOnItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersOnItems" ADD CONSTRAINT "OrdersOnItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
