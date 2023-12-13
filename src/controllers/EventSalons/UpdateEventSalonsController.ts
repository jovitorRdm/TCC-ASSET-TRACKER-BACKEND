import { Request, Response } from "express";
import {
  EventSalonsDTO,
  UpdateEventSalonsDTO,
} from "../../models/dtos/eventSalons";
import { EventSalonsService } from "../../services/EventSalonsService";

export class UpdateEventSalonsController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as UpdateEventSalonsDTO;
    const eventSalonsService = new EventSalonsService();
    const eventSalons = await eventSalonsService.update(id, data);
    return res.json(eventSalons);
  }
}
