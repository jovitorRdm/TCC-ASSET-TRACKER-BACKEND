import { FindAllArgs, IService } from "../interfaces";
import { GenericStatus } from "../models/dtos";
import { CreateFiscalProductDTO, FiscalProductDTO,  } from "../models/dtos/fiscalProduct";
import { FiscalProductRepository } from "../models/repositories/FiscalProductRepository";

export class FiscalProductService implements IService {
    private fiscalProductRepository = new FiscalProductRepository();

    async create(data: CreateFiscalProductDTO) {

        const service = await this.fiscalProductRepository.create(data);
        return service;
    }

    async update(id: string, data: FiscalProductDTO) {

        const updatedFiscalProduct  = await this.fiscalProductRepository.update(id, data);

        return updatedFiscalProduct;
    }

    async changeStatus(id: string, status: GenericStatus) {
        const updatedFiscalProduct  = await this.fiscalProductRepository.update(id, { status });

        return updatedFiscalProduct;
    }

    async list(args: FindAllArgs = {}) {
        const result = await this.fiscalProductRepository.findAll(args);

        return result;
    }

}