import { Request, Response } from 'express'
import { AssignmentDTO } from '../../models/dtos';
import { AssignmentService } from '../../services/AssignmentService';


export class UpdateAssignmentController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body as AssignmentDTO;

        const assignmentService = new AssignmentService();

        const assignment = await assignmentService.update(id, data);

        return res.json(assignment);
    }
}