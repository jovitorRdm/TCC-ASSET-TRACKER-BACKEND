-- AlterTable
ALTER TABLE `product` ADD COLUMN `SaleValue` DOUBLE NULL,
    ADD COLUMN `numberDay` DOUBLE NULL,
    ADD COLUMN `percentage` DOUBLE NULL,
    ADD COLUMN `productType` ENUM('Consumable', 'Rental') NOT NULL DEFAULT 'Consumable';

-- AlterTable
ALTER TABLE `productentry` ADD COLUMN `SaleValue` DOUBLE NULL,
    ADD COLUMN `numberDay` DOUBLE NULL,
    ADD COLUMN `productType` ENUM('Consumable', 'Rental') NOT NULL DEFAULT 'Consumable';

-- CreateTable
CREATE TABLE `budgets` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `status` ENUM('Draft', 'Finalized', 'Approved') NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `validUntil` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `budgets_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget_items` (
    `id` VARCHAR(191) NOT NULL,
    `budgetId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `itemType` ENUM('Product', 'Service', 'Event') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `discount` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `costumer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_items` ADD CONSTRAINT `budget_items_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `budgets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
