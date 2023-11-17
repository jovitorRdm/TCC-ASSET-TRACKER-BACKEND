-- AlterTable
ALTER TABLE `fiscal_product` ADD COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
