import { Product } from "../domains";
import { ProductDTO } from "./product";
import { ProductEntriesDTO } from "./productEntries";
import { GenericStatus } from "./status";

export interface CreateFiscalProductDTO {
  supplierId: string;
  invoiceNumber: string;
  issueDate: string;
  totalAmount: number;
  productEntries: ProductEntriesDTO[];
}

export interface FiscalProductDTO extends CreateFiscalProductDTO {
  id: string;
  status: GenericStatus;
}

export interface UpdateFiscalProductDTO {
  id?: string;
  status?: GenericStatus;
  supplierId?: string;
  invoiceNumber?: string;
  issueDate?: string;
  totalAmount?: number;
  productEntries?: ProductEntriesDTO[];
}
