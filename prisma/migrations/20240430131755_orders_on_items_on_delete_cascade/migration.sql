-- DropForeignKey
ALTER TABLE "OrdersOnItems" DROP CONSTRAINT "OrdersOnItems_orderId_fkey";

-- AddForeignKey
ALTER TABLE "OrdersOnItems" ADD CONSTRAINT "OrdersOnItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
