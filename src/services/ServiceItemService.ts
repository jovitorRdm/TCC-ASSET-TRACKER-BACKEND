import { FindAllArgs, IService } from "../interfaces";
import { CreateServiceDTO, GenericStatus, UpdateServiceDTO } from "../models/dtos";
import { ServiceRepository } from "../models/repositories/ServiceRepository";

export class ServiceItemService implements IService {
    private serviceRepository = new ServiceRepository();

    async create(data: CreateServiceDTO) {
        const service = await this.serviceRepository.create(data);

        return service;
    }

    async update(id: string, data: UpdateServiceDTO) {
        const updatedEvent = await this.serviceRepository.update(id, data);

        return updatedEvent;
    }

    async changeStatus(id: string, status: GenericStatus) {
        const updatedEvent = await this.serviceRepository.update(id, { status });

        return updatedEvent;
    }

    async list(args: FindAllArgs = {}) {
        const result = await this.serviceRepository.findAll(args);

        return result;
    }

}