import { GenericStatus } from "./status";
import { MeasurementUnit } from "./measurementUnite";

export interface CreateProductDTO {
    name: string; 
    quantity: number;
    quantityPerson: number; 
    consumptionPerPerson: number;
    measurementUnit: MeasurementUnit;
    description: string;
    value: number;
  }

export interface ProductDTO extends CreateProductDTO {
    id: string;
    status: GenericStatus;
}

export interface UpdateProductDTO {
    id?: string;
    status?: GenericStatus;
    name?: string; 
    quantity?: number;
    quantityPerson?: number; 
    consumptionPerPerson?: number;
    measurementUnit?: MeasurementUnit;
    description?: string;
    value?: number;
}