import { Request, Response } from "express";
import { AssignmentService, EmployeeService } from "../../services";

export class ChangeEmployeeStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const employeeService = new EmployeeService();

        const employee = await employeeService.changeStatus(id, status);

        return res.json(employee);
    }
}