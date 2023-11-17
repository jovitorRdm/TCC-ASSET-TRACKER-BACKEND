/*
  Warnings:

  - You are about to drop the column `productId` on the `fiscal_product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `fiscal_product` DROP FOREIGN KEY `fiscal_Product_productId_fkey`;

-- AlterTable
ALTER TABLE `fiscal_product` DROP COLUMN `productId`;

-- CreateTable
CREATE TABLE `_FiscalProductToProduct` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FiscalProductToProduct_AB_unique`(`A`, `B`),
    INDEX `_FiscalProductToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FiscalProductToProduct` ADD CONSTRAINT `_FiscalProductToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `fiscal_Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FiscalProductToProduct` ADD CONSTRAINT `_FiscalProductToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
