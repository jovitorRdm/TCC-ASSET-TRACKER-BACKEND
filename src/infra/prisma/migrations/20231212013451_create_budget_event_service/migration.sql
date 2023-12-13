/*
  Warnings:

  - You are about to drop the `budget_details` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `numberPeople` to the `budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeBudget` to the `budget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `budget_details` DROP FOREIGN KEY `budget_details_budgetId_fkey`;

-- DropForeignKey
ALTER TABLE `budget_details` DROP FOREIGN KEY `budget_details_productId_fkey`;

-- DropForeignKey
ALTER TABLE `budget_details` DROP FOREIGN KEY `budget_details_serviceId_fkey`;

-- AlterTable
ALTER TABLE `budget` ADD COLUMN `numberPeople` DOUBLE NOT NULL,
    ADD COLUMN `typeBudget` ENUM('event', 'rent') NOT NULL;

-- DropTable
DROP TABLE `budget_details`;

-- CreateTable
CREATE TABLE `budget_services` (
    `serviceId` VARCHAR(191) NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `budgetId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget_products` (
    `productId` VARCHAR(191) NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `budgetId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `budget_services` ADD CONSTRAINT `budget_services_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `budget`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_services` ADD CONSTRAINT `budget_services_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_products` ADD CONSTRAINT `budget_products_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `budget`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_products` ADD CONSTRAINT `budget_products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
