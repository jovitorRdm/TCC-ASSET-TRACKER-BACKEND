import { FindAllArgs, IService } from "../interfaces";
import { GenericStatus } from "../models/dtos";
import { CreateEventDTO, UpdateEventDTO } from "../models/dtos/events";
import { EventRepository } from "../models/repositories/EventRepository";

export class EventService implements IService {
    private eventRepository = new EventRepository();

    async create(data: CreateEventDTO) {
        const event = await this.eventRepository.create(data);

        return event;
    }

    async update(id: string, data: UpdateEventDTO) {
        const updatedEvent = await this.eventRepository.update(id, data);

        return updatedEvent;
    }

    async changeStatus(id: string, status: GenericStatus) {
        const updatedEvent = await this.eventRepository.update(id, { status });

        return updatedEvent;
    }

    async list(args: FindAllArgs = {}) {
        const result = await this.eventRepository.findAll(args);

        return result;
    }

}