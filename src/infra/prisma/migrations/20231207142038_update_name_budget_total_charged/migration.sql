/*
  Warnings:

  - You are about to drop the column `totalSpent` on the `budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `budget` DROP COLUMN `totalSpent`,
    ADD COLUMN `totalCharged` DOUBLE NOT NULL DEFAULT 0;
