-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `typeDocument` ENUM('cpf', 'cnpj') NOT NULL DEFAULT 'cpf';
