import { AddressDTO, CreateAddressDTO, UpdateAddressDTO } from "./address";
import { GenericStatus } from "./status";

export interface SupplierDTO {
  id: string;
  status: GenericStatus;
  name: string;
  document: string;
  email: string;
  address: CreateAddressDTO;
  birthdate: string;
  phoneNumber: string;
  password: string;
}

export interface CreatedSupplierDTO extends Omit<SupplierDTO, "id"> {}

export interface UpdateSupplierDTO {
  id?: string;
  status?: GenericStatus;
  name?: string;
  document?: string;
  email?: string;
  address?: AddressDTO;
  birthdate?: string;
  phoneNumber?: string;
}
