import { Request, Response } from 'express'
import { EventDTO } from '../../models/dtos/events';
import { EventService } from '../../services/EventService';



export class UpdateEventController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body as EventDTO;

        const eventService = new EventService();

        const event = await eventService.update(id, data);

        return res.json(event);
    }
}