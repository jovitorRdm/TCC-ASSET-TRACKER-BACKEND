/*
  Warnings:

  - You are about to drop the column `productId` on the `assignment` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `consumptionPerPerson` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assignment` DROP FOREIGN KEY `assignment_productId_fkey`;

-- AlterTable
ALTER TABLE `assignment` DROP COLUMN `productId`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `consumptionPerPerson` DOUBLE NOT NULL,
    ADD COLUMN `measurementUnit` ENUM('unit', 'package', 'kilogram', 'liter', 'meter') NOT NULL DEFAULT 'unit',
    MODIFY `quantity` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `fiscal_Product` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `issueDate` DATETIME(3) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fiscal_Product` ADD CONSTRAINT `fiscal_Product_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fiscal_Product` ADD CONSTRAINT `fiscal_Product_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
