-- CreateTable
CREATE TABLE `costumer` (
    `id` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `costumer_cpf_key`(`cpf`),
    UNIQUE INDEX `costumer_email_key`(`email`),
    UNIQUE INDEX `costumer_address_id_key`(`address_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `costumer` ADD CONSTRAINT `costumer_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
