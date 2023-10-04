import { PaginatedResponse } from "../../helpers/utils/PaginatedResponse";
import { Request, Response } from 'express'
import { EmployeeDTO } from "../../models/dtos";
import { EmployeeService } from "../../services/EmployeeService";

export class ListEmployeeController {
    async handle(req: Request, res: Response) {
        const paginatedResponse = new PaginatedResponse<EmployeeDTO>(
            new EmployeeService()
        );

        const response = await paginatedResponse.get(req);
        return res.json(response);
    }
}