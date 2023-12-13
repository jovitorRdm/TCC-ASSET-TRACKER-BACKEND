/*
  Warnings:

  - You are about to drop the column `discont` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmont` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `eventBudgetId` on the `budget_details` table. All the data in the column will be lost.
  - You are about to drop the `event_budget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `budget` DROP FOREIGN KEY `budget_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `budget_details` DROP FOREIGN KEY `budget_details_eventBudgetId_fkey`;

-- DropForeignKey
ALTER TABLE `event_budget` DROP FOREIGN KEY `event_budget_eventTypeId_fkey`;

-- AlterTable
ALTER TABLE `budget` DROP COLUMN `discont`,
    DROP COLUMN `eventId`,
    DROP COLUMN `totalAmont`,
    ADD COLUMN `discount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `eventTypeId` VARCHAR(191) NULL,
    ADD COLUMN `totalAmount` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `budget_details` DROP COLUMN `eventBudgetId`;

-- DropTable
DROP TABLE `event_budget`;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_eventTypeId_fkey` FOREIGN KEY (`eventTypeId`) REFERENCES `event_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
