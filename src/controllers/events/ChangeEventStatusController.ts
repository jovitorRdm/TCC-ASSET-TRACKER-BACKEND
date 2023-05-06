import { Request, Response } from "express";
import { EventService } from "../../services/EventService";
import { AppError, ErrorMessages } from "../../infra/http/errors";

export class ChangeEventStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const eventService = new EventService();

        if (status === undefined) {
            throw new AppError(ErrorMessages.invalidData);
        }

        const event = await eventService.changeStatus(id, status);

        return res.json(event);
    }
}