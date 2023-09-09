import { AddressDTO, CreateAddressDTO } from "./address";
import { GenericStatus } from "./status";

export interface personDTO {   
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
  
  export interface CreatePersonDTO 
    extends Omit<personDTO, 'id' > {}
  
  
  export interface UpdatePersonDTO {
    id?: string;
    status?: GenericStatus;
    name?: string;
    cpf?: string;
    email?: string;
    address?: AddressDTO;
    birthdate?: string;
    phoneNumber?: string;
    password?: string;
    assignmentId?: string;
  }
  