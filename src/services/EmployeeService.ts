import { FindAllArgs, IService } from "../interfaces";
import { CreateEmployeeDTO, GenericStatus, UpdateEmployeeDTO } from "../models/dtos";
import { EmployeeRepository } from "../models/repositories/EmployeeRepository";

export class EmployeeService implements IService{
    private employeeRepository = new EmployeeRepository();

    async create(data: CreateEmployeeDTO) {
        const employee = await this.employeeRepository.create(data);

        return employee;
    }

    async update(id: string, data: UpdateEmployeeDTO) {
        const updatedEmployee = await this.employeeRepository.update(id, data);

        return updatedEmployee;
    }

    async changeStatus(id: string, status: GenericStatus) {
        const updatedEmployee = await this.employeeRepository.update(id, { status });

        return updatedEmployee;
    }

    async list(args: FindAllArgs = {}) {
        const result = await this.employeeRepository.findAll(args);

        return result;
    }

}