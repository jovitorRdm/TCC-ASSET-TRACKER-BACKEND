/*
  Warnings:

  - You are about to drop the column `cpf` on the `person` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document]` on the table `person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document` to the `person` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `person_cpf_key` ON `person`;

-- AlterTable
ALTER TABLE `person` DROP COLUMN `cpf`,
    ADD COLUMN `document` VARCHAR(14) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `person_document_key` ON `person`(`document`);
