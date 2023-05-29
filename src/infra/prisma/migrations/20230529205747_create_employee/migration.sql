-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(8) NOT NULL,
    `city` VARCHAR(120) NOT NULL,
    `state` VARCHAR(2) NOT NULL,
    `neighborhood` VARCHAR(120) NOT NULL,
    `street` VARCHAR(120) NOT NULL,
    `number` VARCHAR(10) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` VARCHAR(191) NOT NULL,
    `assignmentId` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `name` VARCHAR(120) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `phone_number` VARCHAR(11) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `address_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_cpf_key`(`cpf`),
    UNIQUE INDEX `employees_email_key`(`email`),
    UNIQUE INDEX `employees_address_id_key`(`address_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
