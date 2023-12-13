-- AlterTable
ALTER TABLE `budget` ADD COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
