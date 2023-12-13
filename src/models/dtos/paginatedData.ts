import { GenericStatus } from ".";
import { ProductType } from "./productType";

export interface PaginatedDataRequestDTO {
  query?: string;
  page?: number;
  pageSize?: number;
  filterByStatus?: GenericStatus;
  filterByType?: ProductType;
}

export interface PaginatedDataResponseDTO<T> {
  data: T[];
  page: number;
  totalPages: number;
  query?: string;
  filterByStatus?: GenericStatus;
  filterByType?: ProductType;
}
