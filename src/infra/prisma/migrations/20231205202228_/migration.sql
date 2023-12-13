/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `budget_details` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `budget_details` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `budget_details` table. All the data in the column will be lost.
  - You are about to drop the `event_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `returnDate` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeItemBudget` to the `budget_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `budget` DROP FOREIGN KEY `budget_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `event_products` DROP FOREIGN KEY `event_products_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `event_products` DROP FOREIGN KEY `event_products_productId_fkey`;

-- DropForeignKey
ALTER TABLE `event_services` DROP FOREIGN KEY `event_services_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `event_services` DROP FOREIGN KEY `event_services_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_eventTypeId_fkey`;

-- AlterTable
ALTER TABLE `assignment` ADD COLUMN `peopleServed` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `budget` DROP COLUMN `totalAmount`,
    ADD COLUMN `discont` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `returnDate` DATETIME(3) NOT NULL,
    ADD COLUMN `totalAmont` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `totalExtinct` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `budget_details` DROP COLUMN `discount`,
    DROP COLUMN `name`,
    DROP COLUMN `totalPrice`,
    ADD COLUMN `eventBudgetId` VARCHAR(191) NULL,
    ADD COLUMN `typeItemBudget` ENUM('product', 'service') NOT NULL;

-- DropTable
DROP TABLE `event_products`;

-- DropTable
DROP TABLE `event_services`;

-- DropTable
DROP TABLE `events`;

-- CreateTable
CREATE TABLE `event_budget` (
    `id` VARCHAR(191) NOT NULL,
    `eventTypeId` VARCHAR(191) NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event_budget`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_budget` ADD CONSTRAINT `event_budget_eventTypeId_fkey` FOREIGN KEY (`eventTypeId`) REFERENCES `event_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_details` ADD CONSTRAINT `budget_details_eventBudgetId_fkey` FOREIGN KEY (`eventBudgetId`) REFERENCES `event_budget`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
