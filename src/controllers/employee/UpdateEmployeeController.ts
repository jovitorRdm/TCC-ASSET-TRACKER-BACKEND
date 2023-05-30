import { Request, Response } from 'express'
import { AssignmentDTO, EmployeeDTO } from '../../models/dtos';
import { AssignmentService } from '../../services/AssignmentService';
import { Employee } from '@prisma/client';
import { EmployeeService } from '../../services/EmployeeService';


export class UpdateEmployeeController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body as EmployeeDTO;

        const employeeService = new EmployeeService();

        const Employee = await employeeService.update(id, data);

        return res.json(Employee);
    }
}