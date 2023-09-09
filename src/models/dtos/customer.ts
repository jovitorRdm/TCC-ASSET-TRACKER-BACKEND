import { AddressDTO, CreateAddressDTO } from "./address";
import { GenericStatus } from "./status";

export interface customerDTO {   
    id: string;
    status: GenericStatus;
    name: string;
    cpf: string;
    email: string;
    address: CreateAddressDTO;
    birthdate: string;
    phoneNumber: string;
    password: string;
  }
  
  export interface CreateCustomerDTO 
    extends Omit<customerDTO, 'id' > {}
  
  
  export interface UpdateCustomerDTO {
    id?: string;
    status?: GenericStatus;
    name?: string;
    cpf?: string;
    email?: string;
    address?: AddressDTO;
    birthdate?: string;
    phoneNumber?: string;
    password?: string;
  }
  