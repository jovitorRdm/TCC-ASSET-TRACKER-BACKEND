import { MeasurementUnit } from "./measurementUnite";
import { ProductType } from "./productType";
import { GenericStatus } from "./status";

export interface CreateProductDTO {
  name: string;
  description: string;
  consumptionPerPerson: number;
  measurementUnit: MeasurementUnit;
  quantity: number;
  value: number;
  productType?: ProductType;
  numberDay?: number;
  percentage?: number;
  SaleValue?: number;
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
  productType?: ProductType;
  numberDay?: number;
  percentage?: number;
  SaleValue?: number;
}
