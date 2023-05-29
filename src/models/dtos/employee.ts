import { Assignment } from "../domains";
import { AddressDTO, CreateAddressDTO, UpdateAddressDTO } from "./address";
import { AssignmentDTO, UpdateAssignmentDTO } from "./assignment";
import { GenericStatus } from "./status";

export interface CreateEmployeeDTO {
    name: string;
    cpf: string;
    email: string;
    address: CreateAddressDTO;
    assignment: AssignmentDTO;
    birthdate: string;
    phoneNumber: string;
  }
  
  export interface EmployeeDTO extends CreateEmployeeDTO {
    guid: string;
    status: GenericStatus;
    address: AddressDTO;
    assignment: AssignmentDTO;
  }
  
  export interface UpdateEmployeeDTO {
    guid?: string;
    status?: GenericStatus;
    name?: string;
    cpf?: string;
    email?: string;
    address?: UpdateAddressDTO;
    assignment?: UpdateAssignmentDTO;
    birthdate?: string;
    phoneNumber?: string;
    password?: string;
  }
  