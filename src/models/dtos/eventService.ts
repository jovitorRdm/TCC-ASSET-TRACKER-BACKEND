import { GenericStatus } from "./status";

export interface CreateEventServiceDTO {
  eventId: string;
  serviceId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}

export interface EventServiceDTO extends CreateEventServiceDTO {
  id: string;
  status: GenericStatus;
}

export interface UpdateEventServiceDTO {
  eventId?: string;
  id?: string;
  status?: GenericStatus;
  serviceId?: string;
  name?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  discount?: number;
}
