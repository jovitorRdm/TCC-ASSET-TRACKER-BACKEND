import { AccountType } from "./accountType";
import { PaymentMethod } from "./paymentMethod";
import { GenericStatus } from "./status";

export interface AssignmentDTO {
    id: string;
    name: string;
    description: string;
    paymentMethod: PaymentMethod;
    accountRequirement: boolean;
    accountType?: AccountType; 
    paymentValue: number;
    status: GenericStatus;
}

export interface CreateAssignmentDTO
    extends Omit<AssignmentDTO, 'id' | 'status' | 'AccountType'> {}

export interface UpdateAssignmentDTO {
    id?: string;
    name?: string;
    description?: string;
    paymentMethod?: PaymentMethod;
    paymentValue?: number;
    accountRequirement?: boolean;
    accountType?: AccountType; 
    status?: GenericStatus;
}
