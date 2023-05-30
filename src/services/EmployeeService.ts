import { IService } from "../interfaces";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../models/dtos";
import { EmployeeRepository } from "../models/repositories/EmployeeRepository";

export class EmployeeService  {
    private employeeRepository = new EmployeeRepository();

    async create(data: CreateEmployeeDTO) {
        const employee = await this.employeeRepository.create(data);

        return employee;
    }

    async update(id: string, data: UpdateEmployeeDTO) {
        const updatedEmployee = await this.employeeRepository.update(id, data);

        return updatedEmployee;
    }

    // async changeStatus(id: string, status: GenericStatus) {
    //     const updatedAssignment = await this.assignmentRepository.update(id, { status });

    //     return updatedAssignment;
    // }

    // async list(args: FindAllArgs = {}) {
    //     const result = await this.assignmentRepository.findAll(args);

    //     return result;
    // }

}