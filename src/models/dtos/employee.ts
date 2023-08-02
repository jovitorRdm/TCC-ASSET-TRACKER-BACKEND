import { Assignment } from "../domains";
import { AccountType } from "./accountType";
import { AddressDTO, CreateAddressDTO, UpdateAddressDTO } from "./address";
import { GenericStatus } from "./status";

export interface CreateEmployeeDTO {   
    name: string;
    cpf: string;
    email: string;
    address: CreateAddressDTO;
    birthdate: string;
    accontType: AccountType[];
    phoneNumber: string;
    assignmentId: string;
  }
  
  export interface EmployeeDTO extends CreateEmployeeDTO {
    id: string;
    status: GenericStatus;
    assignmentId: string;
  }
  
  export interface UpdateEmployeeDTO {
    id?: string;
    status?: GenericStatus;
    name?: string;
    cpf?: string;
    email?: string;
    address?: AddressDTO;
    birthdate?: string;
    accontType?: AccountType[];
    phoneNumber?: string;
    assignmentId?: string;
    password?: string;
  }
  