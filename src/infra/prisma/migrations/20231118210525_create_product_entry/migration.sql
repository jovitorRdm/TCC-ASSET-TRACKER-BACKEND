/*
  Warnings:

  - You are about to drop the `_fiscalproducttoproduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_fiscalproducttoproduct` DROP FOREIGN KEY `_FiscalProductToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_fiscalproducttoproduct` DROP FOREIGN KEY `_FiscalProductToProduct_B_fkey`;

-- AlterTable
ALTER TABLE `fiscal_product` ADD COLUMN `productId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_fiscalproducttoproduct`;

-- CreateTable
CREATE TABLE `ProductEntry` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `value` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `fiscalProductId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fiscal_Product` ADD CONSTRAINT `fiscal_Product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductEntry` ADD CONSTRAINT `ProductEntry_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductEntry` ADD CONSTRAINT `ProductEntry_fiscalProductId_fkey` FOREIGN KEY (`fiscalProductId`) REFERENCES `fiscal_Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
