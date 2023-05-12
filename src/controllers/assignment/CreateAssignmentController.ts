import { Request, Response } from "express";
import { CreateAssignmentDTO} from "../../models/dtos/assignment";
import { AssignmentService } from "../../services/AssignmentService";

export class CreateAssignmentController {
    async handle(req: Request, res: Response) {

        const data = req.body as CreateAssignmentDTO;
        const assignmentService = new AssignmentService();
        const assignment = await assignmentService.create(data);
        return res.status(201).json(assignment);
    }
}