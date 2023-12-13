-- AlterTable
ALTER TABLE `budget` ADD COLUMN `totalAmount` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `eventSalons` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `addressId` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `capacity` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `eventSalons` ADD CONSTRAINT `eventSalons_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
