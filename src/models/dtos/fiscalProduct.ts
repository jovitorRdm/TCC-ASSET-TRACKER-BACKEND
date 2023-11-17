
import { Product } from "../domains";
import { ProductDTO } from "./product";
import { GenericStatus } from "./status";

export interface CreateFiscalProductDTO{
    supplier: string;
    invoiceNumber: string;
    issueDate: Date;
    products: ProductDTO[];
}

export interface FiscalProductDTO extends CreateFiscalProductDTO{
    id: string;
    status: GenericStatus;
}

export interface UpdateFiscalProductDTO {
    id?: string;
    status?: GenericStatus;
    supplier?: string;
    invoiceNumber?: string;
    issueDate?: Date;
    products?: ProductDTO[];
}
