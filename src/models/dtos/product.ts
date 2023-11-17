import { MeasurementUnit } from "./measurementUnite";
import { GenericStatus } from "./status";

export interface CreateProductDTO {
    name: string; 
    description: string;
    consumptionPerPerson: number;
    measurementUnit: MeasurementUnit;
    quantity: number;
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
    description?: string;
    consumptionPerPerson?: number;
    measurementUnit?: MeasurementUnit;
    quantity?: number;
    value?: number;
}