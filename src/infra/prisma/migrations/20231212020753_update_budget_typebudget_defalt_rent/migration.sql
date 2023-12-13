-- AlterTable
ALTER TABLE `budget` MODIFY `typeBudget` ENUM('event', 'rent') NOT NULL DEFAULT 'rent';
