import { GenericStatus } from "./status";

export interface CreateProductDTO{
    name: string;
    description: string;
    productValue: number;
    productQuantity: number;
    assignments: string[];
}

export interface ProductDTO extends CreateProductDTO {
    id: string;
    status: GenericStatus;
}

export interface UpdateProductDTO {
    id?: string;
    status?: GenericStatus;
    name?: string;
    description?: string;
    productValue?: number;
    productQuantity?: number;
    assignments?: string[];
}