/*
  Warnings:

  - Added the required column `assignmentIds` to the `service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service` ADD COLUMN `assignmentIds` VARCHAR(191) NOT NULL;
