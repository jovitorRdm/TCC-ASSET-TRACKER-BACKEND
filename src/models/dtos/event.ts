import { EventProductDTO } from "./eventProduct";
import { EventServiceDTO } from "./eventService";

export interface CreateEventDTO {
  eventTypeId: string;
  name: string;
  description: string;
  EventServices: EventServiceDTO[];
  EventProducts: EventProductDTO[];
}

export interface EventDTO extends CreateEventDTO {
  id: string;
}

export interface UpdateEventDTO {
  id?: string;
  eventTypeId?: string;
  name?: string;
  description?: string;
  EventServices?: EventServiceDTO[];
  EventProducts?: EventProductDTO[];
}
