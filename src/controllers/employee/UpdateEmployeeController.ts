import { Request, Response } from 'express';
import { UpdateEmployeeDTO } from '../../models/dtos';
import { EmployeeService } from '../../services/EmployeeService';

export class UpdateEmployeeController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as UpdateEmployeeDTO;

    const employeeService = new EmployeeService();

    const employee = await employeeService.update(id, data);

    return res.json(employee);
  }
}
