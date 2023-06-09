import { AddressDTO, CreateAddressDTO, UpdateAddressDTO } from "./address";
import { GenericStatus } from "./status";

export interface CreateCustomerDTO {   
    name: string;
    cpf: string;
    email: string;
    address: CreateAddressDTO;
    birthdate: string;
    phoneNumber: string;
  }
  
  export interface CustomerDTO extends CreateCustomerDTO {
    id: string;
    status: GenericStatus;
  }
  
  export interface UpdateCustomerDTO {
    id?: string;
    status?: GenericStatus;
    name?: string;
    cpf?: string;
    email?: string;
    address?: AddressDTO;
    birthdate?: string;
    phoneNumber?: string;
    assignmentId?: string;
  }
  