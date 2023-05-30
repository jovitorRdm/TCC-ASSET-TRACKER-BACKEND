export interface AddressDTO {
    id: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  }
  
  export interface CreateAddressDTO
  extends Omit<AddressDTO, 'id' > {}
  

  export interface UpdateAddressDTO {
    id?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    cep?: string;
  }