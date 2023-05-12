import { PaginatedResponse } from "../../helpers/utils/PaginatedResponse";
import { Request, Response } from 'express'
import { AssignmentDTO } from "../../models/dtos";
import { AssignmentService } from "../../services/AssignmentService";

export class ListAssignmentController {
    async handle(req: Request, res: Response) {
        const paginatedResponse = new PaginatedResponse<AssignmentDTO>(
            new AssignmentService()
        );

        const response = await paginatedResponse.get(req);
        return res.json(response);
    }
}