/*
  Warnings:

  - Added the required column `pickupDate` to the `budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `budget` ADD COLUMN `pickupDate` DATETIME(3) NOT NULL;
