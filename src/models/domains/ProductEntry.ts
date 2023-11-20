import { AppError, ErrorMessages } from "../../infra/http/errors";
import { GenericStatus, MeasurementUnit } from "../dtos";
import { z } from "zod";


export class ProductEntry {
    constructor(
        private _productId: string,
        private _quantity: number,
        private _value: number,
        private _id?: string,
    ){}

    get id() {
        return this._id
    }

    get productId() {
        return this._productId
    }

    get quantity() {
        return this._quantity
    }

    get value() {
        return this._value
    }
    
    set id(id: string) {
        this._id = id
    }

    set productId(productId: string) {
        this._productId = productId
    }

    set quantity(quantity: number) {
        this._quantity = quantity
    }

    set value(value: number) {
        this._value = value
    }

    toJSON() {
        return {
            id: this.id,
            productId: this.productId,
            quantity: this.quantity,
            value: this.value
        }
    }

    validate() {
        const productEntrySchema = z
        .object({
            id: z.string().uuid('id inválido'),
            productId: z.string(),
            quantity: z.number(),
            value: z.number(),
        })
        .partial({ id: true, status: true })
        try {
            productEntrySchema.parse(this);
        }
        catch (err) {
            throw new AppError(err.issues[0].message);
        }
    }
}