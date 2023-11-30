/*
  Warnings:

  - Added the required column `name` to the `budget_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `event_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `event_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `budget_details` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `event_products` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `event_services` ADD COLUMN `name` VARCHAR(191) NOT NULL;
