import { AddressDTO, CreateAddressDTO } from "./address";
import { GenericStatus } from "./status";

export interface CustomerDTO {   
    id: string;
    status: GenericStatus;
    name: string;
    document: string;
    email: string;
    address: CreateAddressDTO;
    birthdate: string;
    phoneNumber: string;
  }
  
  export interface CreateCustomerDTO 
    extends Omit<CustomerDTO, 'id' > {}
  
  
  export interface UpdateCustomerDTO {
    id?: string;
    status?: GenericStatus;
    name?: string;
    document?: string;
    email?: string;
    address?: AddressDTO;
    birthdate?: string;
    phoneNumber?: string;
  }
  