import { AppError, ErrorMessages } from "../../infra/http/errors";
import { GenericStatus } from "../dtos";
import { z } from "zod";

export class Product {
    constructor(
        private _name: string,
        private _description: string,
        private _productValue: number,
        private _productQuantity: number,
        private _assignments: string[],
        private _status?: GenericStatus,
        private _id?: string

    ) {}
   
    get id() {
        return this._id!;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get assignments() {
        return this._assignments;
    }

    get productValue() {
        return this._productValue;
    }

    get productQuantity() {
        return this._productQuantity;
    }

    get status() {
        return this._status!;
    }

    set id(id: string) {
        this._id = id;
    }

    set name(name: string) {
        this._name = name;
    }

    set description(description: string) {
        this._description = description;
    }

    set assignments(assignments: string[]) {
        this._assignments = assignments;
    }

    set productValue(productValue: number) {
        this._productValue = productValue;
    }

    set productQuantity(productQuantity: number) {
        this._productQuantity = productQuantity;
    }

    set status(status: GenericStatus) {
        this._status = status;
    }

    validate() {
        const productSchema = z
        .object({
            id: z.string().uuid('id inválido'),
            status: z.enum([GenericStatus.active, GenericStatus.inactive], {
              errorMap: () => new AppError(ErrorMessages.MSGE06),
            }),
            name: z
              .string({ required_error: ErrorMessages.MSGE01 })
              .min(3, ErrorMessages.MSGE08)
              .max(120, ErrorMessages.MSGE09),
            description: z.string().max(500, ErrorMessages.MSGE09),
            assignments: z.array(z.string().uuid('id de atribuição inválido')),
            // productValue: z.number().negative(ErrorMessages.MSGE06),
            // productQuantity: z.number().negative(ErrorMessages.MSGE06),
          })
          .partial({ id: true, status: true });
    
        try {
          productSchema.parse(this);
        } catch (err) {
          throw new AppError(err.issues[0].message);
        }
    }
}