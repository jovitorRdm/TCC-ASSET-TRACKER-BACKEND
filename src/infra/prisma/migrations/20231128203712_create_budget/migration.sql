/*
  Warnings:

  - You are about to drop the `budget_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `budgets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `budget_items` DROP FOREIGN KEY `budget_items_budgetId_fkey`;

-- DropForeignKey
ALTER TABLE `budgets` DROP FOREIGN KEY `budgets_customerId_fkey`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `eventId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `eventId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `budget_items`;

-- DropTable
DROP TABLE `budgets`;

-- CreateTable
CREATE TABLE `budget` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NULL,
    `totalAmount` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `budget_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget_details` (
    `id` VARCHAR(191) NOT NULL,
    `budgetId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `serviceId` VARCHAR(191) NULL,
    `quantity` DOUBLE NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `description` VARCHAR(500) NULL,
    `eventTypeId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `events_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `costumer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget` ADD CONSTRAINT `budget_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_details` ADD CONSTRAINT `budget_details_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `budget`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_details` ADD CONSTRAINT `budget_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_details` ADD CONSTRAINT `budget_details_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_eventTypeId_fkey` FOREIGN KEY (`eventTypeId`) REFERENCES `event_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
