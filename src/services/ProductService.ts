import { FindAllArgs } from "../interfaces";
import { CreateProductDTO, GenericStatus, UpdateProductDTO } from "../models/dtos";
import { ProductRepository } from "../models/repositories";

export class ProductService{
    private productRepository = new ProductRepository();

    async create(data: CreateProductDTO){
        const product = await this.productRepository.create(data);

        return product;
    }

    async update(id: string, data: UpdateProductDTO){
        const product = await this.productRepository.update(id, data);

        return product;
    }

    async changeStatus(id: string, status: GenericStatus){
        const product = await this.productRepository.update(id, { status });

        return product;
    }

    async list(args: FindAllArgs = {}){
        const result = await this.productRepository.findAll(args);

        return result;
    }
}