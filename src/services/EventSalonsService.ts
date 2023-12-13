import { FindAllArgs, IService } from "../interfaces";
import { GenericStatus } from "../models/dtos";
import {
  CreateEventSalonsDTO,
  UpdateEventSalonsDTO,
} from "../models/dtos/eventSalons";
import { EventSalonsRepository } from "../models/repositories/EventSalonsRepository";

export class EventSalonsService implements IService {
  private eventRepository = new EventSalonsRepository();

  async create(data: CreateEventSalonsDTO) {
    const event = await this.eventRepository.create(data);

    return event;
  }

  async update(id: string, data: UpdateEventSalonsDTO) {
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
