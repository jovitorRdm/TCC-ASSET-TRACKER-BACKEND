import { PaginatedResponse } from "../../helpers/utils/PaginatedResponse";
import { EventDTO } from "../../models/dtos/events";
import { EventService } from "../../services/EventService";
import { Request, Response } from 'express'

export class ListEventController {
    async handle(req: Request, res: Response) {
        const paginatedResponse = new PaginatedResponse<EventDTO>(
            new EventService()
        );

        const response = await paginatedResponse.get(req);
        return res.json(response);
    }
}