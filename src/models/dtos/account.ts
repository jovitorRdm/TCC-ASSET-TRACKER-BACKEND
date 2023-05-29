import { GenericStatus } from "./status";

export interface AccountDTO {
    id: number;
    name: string;
    email: string;
    password: string; 
    status: GenericStatus;
}

export interface CreateAccountDTO
    extends Omit<AccountDTO, 'id' | 'status' > {}

export interface UpdateAccountDTO {
    id?: number;
    name?: string;
    email?: string;
    password?: string; 
    status?: GenericStatus;
}