import { Request, Response } from "express";
import { EmployeeService } from "../../services/EmployeeService";
import { CreateEmployeeDTO } from "../../models/dtos";

export class CreateEmployeeController {
    async handle(req: Request, res: Response) {

        const data = req.body as CreateEmployeeDTO;
        const employeeService = new EmployeeService();
        const assignment = await employeeService.create(data);
        return res.status(201).json(assignment);
    }
}