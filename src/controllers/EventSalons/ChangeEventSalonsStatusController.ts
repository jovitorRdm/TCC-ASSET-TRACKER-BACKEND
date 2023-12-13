import { Request, Response } from "express";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { EventSalonsService } from "../../services/EventSalonsService";

export class ChangeEventSalonsStatusController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const eventSalonsService = new EventSalonsService();

    const eventSalons = await eventSalonsService.changeStatus(id, status);

    return res.json(eventSalons);
  }
}
