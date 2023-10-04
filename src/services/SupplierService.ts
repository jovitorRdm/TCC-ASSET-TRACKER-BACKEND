import { generatePassword } from "../helpers/utils/generatePassword";
import { FindAllArgs } from "../interfaces";
import { GenericStatus } from "../models/dtos";
import { CreatedSupplierDTO, UpdateSupplierDTO } from "../models/dtos/supplier";
import { SupplierRepository } from "../models/repositories/SupplierRepository";


export class SupplierService {
    private supplierRepository = new SupplierRepository();

    async create(data: CreatedSupplierDTO){
        const supplier = await this.supplierRepository.create(data);
        return supplier;
    }

    async update(id: string, data: UpdateSupplierDTO){
        const updateSupplier = await this.supplierRepository.update(id, data);
        return updateSupplier;
    }

    async changeStatus(id: string, status: GenericStatus){
        const updateSupplier = await this.supplierRepository.update(id, {
            status
        });

        return updateSupplier;
    }

    async list(args: FindAllArgs = {}) {
        const result = await this.supplierRepository.findAll(args);
        return result;
    }
}