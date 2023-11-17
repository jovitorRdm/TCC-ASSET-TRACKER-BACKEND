import { AppError, ErrorMessages } from "../../infra/http/errors";
import { GenericStatus, ProductDTO } from "../dtos";
import { Product } from "./Product";
import { z } from "zod";


export class FiscalProduct {
    constructor(
        private _supplier: string,
        private _invoiceNumber: string,
        private _issueDate: Date,
        private _products: ProductDTO[],
        private _status?: GenericStatus,
        private _id?: string,
    ) {}

    get id() {
        return this._id!;
    }

    get status() {
        return this._status!;
    }

    get supplier() {
        return this._supplier;
    }

    get invoiceNumber(){
        return this._invoiceNumber;
    }

    get issueDate(){
        return this._issueDate;
    }

    get products(){
        return this._products;
    }

    set id(id: string) {
        this._id = id;
    }

    set status(status: GenericStatus) {
        this._status = status;
    }

    set supplier(supplier: string) {
        this._supplier = supplier;
    }

    set invoiceNumber(invoiceNumber: string) {
        this._invoiceNumber = invoiceNumber;
    }

    set issueDate(issueDate: Date) {
        this._issueDate = issueDate;
    }

    set products(products: ProductDTO[]) {
        this._products = products;
    }

    toJSON() {
        return {
            id: this.id,
            status: this.status,
            supplier: this.supplier,
            invoiceNumber: this.invoiceNumber,
            issueDate: this.issueDate,
            products: this.products
        };
    }
    validate(){
        const FiscalProductSchema = z
        .object({
            id: z.string().uuid(),
            status: z.enum([GenericStatus.active, GenericStatus.inactive], {
                errorMap: () => new AppError(ErrorMessages.MSGE06),
            }), 
            supplier: z.string(),
            invoiceNumber: z.number(),
            issueDate: z.string(),     
            products: z.array(z.object({
                id: z.string().uuid('id inv LTD'),
                status: z.enum([GenericStatus.active, GenericStatus.inactive], {
                    errorMap: () => new AppError(ErrorMessages.MSGE06),
                }),
            })
            .partial({id: true, status: true})
            ),
        })
        .partial({id: true, status: true})
        try {
            FiscalProductSchema.parse(this);
        } catch (err) {
          throw new AppError(err.issues[0].message);
        }
    }


}
