import { Request, Response } from "express";
import { CreateEventDTO } from "../../models/dtos/events";
import { EventService } from "../../services/EventService";


export class CreateEventsController {
    async handle(req: Request, res: Response) {

        const data = req.body as CreateEventDTO;
        const eventService = new EventService();
        const event = await eventService.create(data);
        return res.status(201).json(event);
    }
}