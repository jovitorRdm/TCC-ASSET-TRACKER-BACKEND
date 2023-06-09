import { Request, Response } from "express";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { AssignmentService } from "../../services";
import { EmployeeRepository } from "../../models/repositories/EmployeeRepository";
import { AssignmentRepository } from "../../models/repositories/AssignmentRepository";

export class ChangeAssignmentStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const assignmentService = new AssignmentService();
        const assignmentRepository = new AssignmentRepository();

        if (status === undefined) {
            throw new AppError(ErrorMessages.MSGE06);
        }

        if (status) {
            const hasAssociatedEmployees = await assignmentRepository.checkAssociatedEmployees(id);
      
            if (hasAssociatedEmployees === true) {
              throw new AppError(ErrorMessages.MSGE04);
            }
        }

        if (status === undefined) {
            throw new AppError(ErrorMessages.MSGE06);
        }


        const assignment = await assignmentService.changeStatus(id, status);

        return res.json(assignment);
    }
}