import { GenericStatus } from "./status";

export interface EventDTO {
    id: string;
    status: GenericStatus;
    name: string;
    description: string;
}

export interface CreateEventDTO
    extends Omit<EventDTO, 'id' | 'status'> { }

export interface UpdateEventDTO {
    id?: string;
    status?: GenericStatus;
    name?: string;
    description?: string;
}
