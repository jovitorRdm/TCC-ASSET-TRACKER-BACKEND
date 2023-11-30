/*
  Warnings:

  - You are about to drop the column `discount` on the `budget_items` table. All the data in the column will be lost.
  - The values [Product,Service] on the enum `budget_items_itemType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `pickupDate` to the `budgets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `budget_items` DROP COLUMN `discount`,
    MODIFY `itemType` ENUM('Rental', 'Event') NOT NULL;

-- AlterTable
ALTER TABLE `budgets` ADD COLUMN `pickupDate` DATETIME(3) NOT NULL;
