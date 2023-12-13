import { Request, Response } from "express";
import { CreateEventSalonsDTO } from "../../models/dtos/eventSalons";
import { EventSalonsService } from "../../services/EventSalonsService";

export class CreateEventsSalonsController {
  async handle(req: Request, res: Response) {
    const data = req.body as CreateEventSalonsDTO;
    const eventSalonsService = new EventSalonsService();
    const eventSalons = await eventSalonsService.create(data);
    return res.status(201).json(eventSalons);
  }
}
