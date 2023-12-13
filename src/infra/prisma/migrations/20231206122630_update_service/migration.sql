/*
  Warnings:

  - You are about to drop the `_assignmenttoservice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assignmentId` to the `service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_assignmenttoservice` DROP FOREIGN KEY `_AssignmentToService_A_fkey`;

-- DropForeignKey
ALTER TABLE `_assignmenttoservice` DROP FOREIGN KEY `_AssignmentToService_B_fkey`;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `assignmentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `saleValue` DOUBLE NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `_assignmenttoservice`;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
