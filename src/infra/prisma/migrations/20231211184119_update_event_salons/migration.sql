/*
  Warnings:

  - Added the required column `description` to the `eventSalons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `eventSalons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `eventsalons` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
