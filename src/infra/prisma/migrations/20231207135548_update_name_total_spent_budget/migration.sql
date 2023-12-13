/*
  Warnings:

  - You are about to drop the column `totalExtinct` on the `budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `budget` DROP COLUMN `totalExtinct`,
    ADD COLUMN `totalSpent` DOUBLE NOT NULL DEFAULT 0;
