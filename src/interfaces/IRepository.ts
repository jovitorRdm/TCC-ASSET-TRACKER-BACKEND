import { GenericStatus } from "../models/dtos";
import { ProductType } from "../models/dtos/productType";

export type FindAllArgs = {
  skip?: number;
  take?: number;
  searchTerm?: string;
  filterByStatus?: GenericStatus;
  filterByType?: ProductType;
  itemsToExclude?: string[];
};

export type FindAllReturn = {
  data: unknown[];
  totalItems: number;
};

export interface IRepository {
  create(data: unknown): Promise<unknown>;
  update(id: string, data: unknown): Promise<unknown>;
  findAll(args?: FindAllArgs): Promise<FindAllReturn>;
}
