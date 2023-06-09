import { FindAllArgs, IService } from "../interfaces";
import { CreateCustomerDTO, GenericStatus, UpdateCustomerDTO } from "../models/dtos";
import { CustomerRepository } from "../models/repositories/CustomerRepository";


export class CustomerService implements IService{
    private customerRepository = new CustomerRepository();

    async create(data: CreateCustomerDTO) {
        const customer = await this.customerRepository.create(data);

        return customer;
    }

    async update(id: string, data: UpdateCustomerDTO) {
        const updatedCustomer = await this.customerRepository.update(id, data);

        return updatedCustomer;
    }

    async changeStatus(id: string, status: GenericStatus) {
        const updatedCustomer = await this.customerRepository.update(id, { status });

        return updatedCustomer;
    }

    async list(args: FindAllArgs = {}) {
        const result = await this.customerRepository.findAll(args);

        return result;
    }

}