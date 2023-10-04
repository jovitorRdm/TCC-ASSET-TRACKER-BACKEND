import { Request, Response } from "express";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { AssignmentService } from "../../services";

export class ChangeAccountStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const assignmentService = new AssignmentService();

        if (status === undefined) {
            throw new AppError(ErrorMessages.MSGE06);
        }

        const assignment = await assignmentService.changeStatus(id, status);

        return res.json(assignment);
    }
}