import { GenericStatus } from "./status";

export interface CreateServiceDTO {
  name: string;
  description: string;
  assignmentId: string;
  saleValue: number;
}

export interface ServiceDTO extends CreateServiceDTO {
  id: string;
  status: GenericStatus;
}

export interface UpdateServiceDTO {
  id?: string;
  status?: GenericStatus;
  name?: string;
  description?: string;
  assignmentId?: string;
  saleValue?: number;
}
