import { GenericStatus } from "./status";

export interface CreateEventProductDTO {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}

export interface EventProductDTO extends CreateEventProductDTO {
  id: string;
  status: GenericStatus;
}

export interface UpdateEventProductDTO {
  id?: string;
  status?: GenericStatus;
  productId?: string;
  name?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  discount?: number;
}
