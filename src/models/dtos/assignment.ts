import { PaymentMethod } from "./paymentMethod";
import { GenericStatus } from "./status";


export interface AssignmentDTO {
    id: string;
    name: string;
    description: string;
    paymentMethod: PaymentMethod;
    paymentValue: number;
    status: GenericStatus;
}

export interface CreateAssignmentDTO
    extends Omit<AssignmentDTO, 'id' | 'status'> { }

export interface UpdateAssignmentDTO {
    id?: string;
    name?: string;
    description?: string;
    paymentMethod?: PaymentMethod;
    paymentValue?: number;
    status?: GenericStatus;
}
