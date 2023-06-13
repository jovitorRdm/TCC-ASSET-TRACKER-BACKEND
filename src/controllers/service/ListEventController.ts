import { PaginatedResponse } from "../../helpers/utils/PaginatedResponse";
import { Request, Response } from 'express'
import { ServiceDTO } from "../../models/dtos";
import { ServiceItemService } from "../../services/ServiceItemService";

export class ListServicesController {
    async handle(req: Request, res: Response) {
        const paginatedResponse = new PaginatedResponse<ServiceDTO>(
            new ServiceItemService()
        );

        const response = await paginatedResponse.get(req);
        return res.json(response);
    }
}