import { AddressDTO, CreateAddressDTO, UpdateAddressDTO } from "./address";
import { GenericStatus } from "./status";

export interface EventSalonsDTO {
  id: string;
  status: GenericStatus;
  name: string;
  description: string;
  address: CreateAddressDTO;
  value: number;
  capacity: number;
}

export interface CreateEventSalonsDTO
  extends Omit<EventSalonsDTO, "id" | "status"> {}

export interface UpdateEventSalonsDTO {
  id?: string;
  status?: GenericStatus;
  name?: string;
  description?: string;
  address?: AddressDTO;
  value?: number;
  capacity?: number;
}
