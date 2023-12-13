-- DropForeignKey
ALTER TABLE `eventsalons` DROP FOREIGN KEY `eventSalons_addressId_fkey`;

-- AddForeignKey
ALTER TABLE `EventSalons` ADD CONSTRAINT `EventSalons_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
