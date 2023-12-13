import { Request, Response } from "express";
import { EventService } from "../../services/EventService";

export class ChangeEventStatusController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const eventService = new EventService();

    const event = await eventService.changeStatus(id, status);

    return res.json(event);
  }
}
