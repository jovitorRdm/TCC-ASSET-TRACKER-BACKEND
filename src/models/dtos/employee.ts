import { AddressDTO, CreateAddressDTO } from "./address";
import { GenericStatus } from "./status";
export interface EmployeeDTO {   
    id: string;
    status: GenericStatus;
    name: string;
    document: string;
    email: string;
    address: CreateAddressDTO;
    birthdate: string;
    phoneNumber: string;
    password: string;
    assignmentId: string;
  }
  
  export interface CreatedEmployeeDTO 
   extends Omit<EmployeeDTO, 'id' > {}
  
  export interface UpdateEmployeeDTO {
    id?: string;
    status?: GenericStatus;
    name?: string;
    document?: string;
    email?: string;
    address?: AddressDTO;
    birthdate?: string;
    phoneNumber?: string;
    password?: string;
    assignmentId?: string;
  }
  