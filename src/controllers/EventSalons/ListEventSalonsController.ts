import { PaginatedResponse } from "../../helpers/utils/PaginatedResponse";
import { Request, Response } from "express";
import { EventSalonsDTO } from "../../models/dtos/eventSalons";
import { EventSalonsService } from "../../services/EventSalonsService";

export class ListEventSalonsController {
  async handle(req: Request, res: Response) {
    const paginatedResponse = new PaginatedResponse<EventSalonsDTO>(
      new EventSalonsService()
    );

    const response = await paginatedResponse.get(req);
    return res.json(response);
  }
}
