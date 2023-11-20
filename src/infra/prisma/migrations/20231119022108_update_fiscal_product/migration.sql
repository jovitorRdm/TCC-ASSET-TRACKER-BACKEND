/*
  Warnings:

  - You are about to drop the column `productId` on the `fiscal_product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `fiscal_product` DROP FOREIGN KEY `fiscal_Product_productId_fkey`;

-- AlterTable
ALTER TABLE `fiscal_product` DROP COLUMN `productId`;
