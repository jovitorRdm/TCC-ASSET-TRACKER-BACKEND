import { Assignment } from "../domains";
import { AddressDTO, CreateAddressDTO, UpdateAddressDTO } from "./address";
import { GenericStatus } from "./status";

export interface CreateEmployeeDTO {   
    name: string;
    cpf: string;
    email: string;
    address: CreateAddressDTO;
    birthdate: string;
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
    address?: UpdateAddressDTO;
    birthdate?: string;
    phoneNumber?: string;
    password?: string;
    assignmentId?: string;
  }
  